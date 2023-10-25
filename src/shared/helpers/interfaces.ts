export type Interface = {
  id: string;
  name: string;
  playground: boolean;
  documentation: string;
  icon: string;
};

const interfaces: Interface[] = [
  {
    id: "chat",
    name: "Chat",
    playground: true,
    documentation: "# Chat",
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/chat.svg",
  },
  {
    id: "embeddings",
    name: "Embeddings",
    playground: false,
    documentation:
      '# Embeddings\n\n## Description\n\nEmbeddings are all the services used to transform unstructured text in a vector representation. A vector representation is a vector of numbers that represents the most important features of the text. For example, a sentence can be represented as a vector of numbers. The vector is obtained using a neural network that is trained to extract the most important features of the sentence. Embeddings are used in many NLP tasks, such as text classification, text clustering, text similarity, and so on. In order to give memory to ChatGPT, we need to transform the text in a vector representation and store them in a vectorstore for later retrieval.\n\nAll the services compatible with Prem Embeddings interface expose an API that can be used directly with Langchain python library. You can find the library [here](https://python.langchain.com/en/latest/index.html).\n\n## Getting Started\n\n```python\nimport os\n\nfrom langchain.embeddings import OpenAIEmbeddings\n\nos.environ["OPENAI_API_KEY"] = "random-string"\n\n# assuming the service is running on localhost\nembeddings = OpenAIEmbeddings(openai_api_base="http://localhost:8000/api/v1")\n\ntext = "Prem is an easy to use open source AI platform."\nquery_result = embeddings.embed_query(text)\ndoc_result = embeddings.embed_documents([text])\n```\n\n',
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/embeddings.svg",
  },
  {
    id: "vector-store",
    name: "Vector Store",
    playground: false,
    documentation:
      "# Vector Store\n\n## Description\n\nVector Store are all the services that expose a vector database. A vector database is used to store embeddings. An embedding is a vector representation of a piece of data. For example, a sentence can be represented as a vector of numbers. The vector is obtained using a neural network that is trained to extract the most important features of the sentence.\n\n## Installation & Usage\n\nWe don't have a standard interface for what concerns Vector Store services. However, we suggest to connect to the services using [Langchain](https://python.langchain.com/en/latest/index.html) python library or [Llama Index](https://gpt-index.readthedocs.io/en/latest/index.html).\n",
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/store.svg",
  },
  {
    id: "coder",
    name: "Coder",
    playground: true,
    documentation:
      "# Coder\n\n## Description\n\nCoder are all the services that expose endpoints for code completion functionalities. As an example, you can think about GitHub Copilot as the main centralized alternative.\n\n## Installation & Usage\n\nWe don't have a standard interface for what concerns Coder services. However, right now we mostly support services based on Tabby Docker images. In order to use Tabby services, you will need to install and use Tabby extension. You can find the extension [here](https://marketplace.visualstudio.com/items?itemName=TabbyML.vscode-tabby).\n",
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/coder.svg",
  },
  {
    id: "diffuser",
    name: "Diffuser",
    playground: true,
    documentation: "# Prem Diffuser",
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/diffuser.svg",
  },
  {
    id: "upscaler",
    name: "Upscaler",
    playground: true,
    documentation: "# Prem Upscaler",
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/upscaler.svg",
  },
  {
    id: "text-to-audio",
    name: "Text to Audio",
    playground: true,
    documentation: "# Prem Text to Audio",
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/tta.svg",
  },
  {
    id: "audio-to-text",
    name: "Audio to Text",
    playground: true,
    documentation: "# Prem Audio to Text",
    icon: "https://raw.githubusercontent.com/premAI-io/static.premai.io/main/daemon/interfaces/att.svg",
  },
];

export default interfaces;
