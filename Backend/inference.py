# inference.py
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate

class Chatbot:
    def __init__(self):
        self.llm = self.initialize_llm()
        self.keywords = ["death", "murder", "suicide", "harm", "kill"]

    def initialize_llm(self):
        return ChatGroq(
            temperature=0,
            groq_api_key="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",
            model_name="llama-3.3-70b-versatile"
        )

    
    def process_query(self, query):
        # Check for sensitive keywords
        alert_message = None
        if any(keyword in query.lower() for keyword in self.keywords):
            alert_message = "It seems you mentioned something serious. Please remember to take care of your mental health."

        # Define prompt template for compassionate responses
        prompt_template = """You are a compassionate mental health chatbot. Respond thoughtfully to the following user query:
        User: {question}
        Chatbot: """
        prompt = PromptTemplate(template=prompt_template, input_variables=['question'])

        # Create a chain to process the query
        chain = prompt | self.llm
        response = chain.invoke({"question": query}).content

        return {"response": response, "alert": alert_message}