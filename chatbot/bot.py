from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain.tools import BaseTool
from langgraph.prebuilt import ToolNode
from langgraph.graph import StateGraph, MessagesState, START, END
from IPython.display import Image, display
from langchain_core.messages import HumanMessage
from dotenv import dotenv_values
from flask_cors import CORS
config = dotenv_values(".env")


model_key = config.get("GPT_KEY")
google_key = config.get("GOOGLE_KEY")


print(model_key)
# For flask application
# app.py
from flask import Flask, request, jsonify

flk = Flask(__name__)
CORS(flk)
CORS(flk, origins=["*"])
# For PDF Chunks splitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter


llm = ChatGroq(model_name="Gemma2-9b-It", api_key=model_key)
glm = ChatGroq(model_name="Gemma2-9b-It", api_key=model_key)

# Setting up RAG application
loader = PyPDFLoader(r"bot.pdf")
doc = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
texts = text_splitter.split_documents(doc)
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001", google_api_key=google_key
)
vectorStore = Chroma.from_documents(
    documents=texts, embedding=embeddings, persist_directory="./chroma_db"
)


# Making our rag_retriver as a tool
class CustomSearchTool(BaseTool):
    name: str = "RAG on website documents"
    description: str = (
        "Useful for gaining information about detailed workings of the Project Portal Website"
    )

    def _run(self, query: str) -> str:
        print(f"Tool is called {query}")
        retrived_docs = vectorStore.similarity_search(query, k=3)
        context = "\n".join([doc.page_content for doc in retrived_docs])
        return f"{context}"

    async def _arun(self, query: str) -> str:
        raise NotImplementedError("Does not support async")


# A function for decision making process
def call_model_before_rag(state):
    print(f"Before making decision is called")
    message = state["messages"][0].content
    history = state["messages"][1].content
    prompt = f"""
        You are working as a chatbot for a website. You are implemented in a RAG application.
        The website is Project portal system for engineering students where student from different colleges can display their authorised projects.
        Your current task is to understand the below question and decide 2 things.
        Whether the query is related to the working or in use of the website. If yes you have to call the tool whihc is provided to you. 
        Along with that tool you have to pass an argument by simplying the user question for better RAG results.

        The USER QUESTION may also consists of last 10 conversation you had with user which you can treat as your memory

        If the query is not related to the website or its working. You simply have to answer
        ***I Cannot help you with that information***
        HISTORY: {history}
        USER QUESTION: {message}
    """
    response = llm.invoke(prompt)
    return {"messages": [response]}


# A router fucntion to decide whether its over or not
def router_function(state):
    print("Called")
    message = state["messages"][-1]
    # print(f"Messgae in responses {message}")
    if message.tool_calls:
        return "tools"
    return END


# A function for optimizing the output
def call_model_after_rag(state):
    org_message = state["messages"][0].content
    context = state["messages"][-1]
    prompt = f""" 
      System: With the provided context and question, Construcut a final simple summarized answer
      You have to answer the provied question with the help of provided Context only. If you cannot answer from the given context write
      ***I Cannot help you with tha information***

      Context: {context}
      Question: {org_message}
      """
    print(prompt)
    response = glm.invoke(prompt)
    # print(response)
    return {"messages": [response]}


# Binding the rag tool with the LLM
rag_tool = CustomSearchTool()
tools = [rag_tool]
tool_node = ToolNode(tools=tools)
llm = llm.bind_tools(tools)

workflow = StateGraph(MessagesState)
workflow.add_node("pre_llm", call_model_before_rag)
workflow.add_node("tools", tool_node)
workflow.add_node("post_llm", call_model_after_rag)
workflow.add_edge(START, "pre_llm")
workflow.add_edge("tools", "post_llm")
workflow.add_edge("post_llm", END)
workflow.add_conditional_edges("pre_llm", router_function, {"tools": "tools", END: END})
app = workflow.compile()



@flk.route("/process_data", methods=["POST"])
def process_data():
    try:
        data = request.get_json()  
        print(data,"hello")
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        
        # Example: Extract a "text" field and manipulate it.
        if "messages" in data and "history" in data:
            question = data["messages"]
            history = data["history"]

            resp = app.invoke(
                {
                    "messages": [
                        HumanMessage(content=question),
                        HumanMessage(content=history),
                    ]
                }
            )
            result = resp["messages"][-1].content
            return jsonify(result), 200
        else:
            return jsonify({"error": 'Missing "text" field in JSON data'}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Handle exceptions


if __name__ == "__main__":
    flk.run(debug=True)  # remove debug=true in production.
