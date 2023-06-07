# 🖥 Prem App

`BADGES`

`SHORT_DESCRIPTION`

`VIDEO`

## Installation

Download the latest version of the app from [here](https://github.com).

Otherwise, you can install Prem on your server by running the following command:

```bash
curl -fsSL https://get.prem.ninja/install.sh | bash
```

## Product Roadmap

If you wanna know which services we support for each interface, please refer to Prem Registry https://premai-io.github.io/prem-registry-ui/.

### Interfaces

- [x] 😃 Prem Chat
- [x] 📕 Prem Embeddings
- [x] 🏛️ Prem Store
- [ ] 🎨 Prem Michelangelo
- [ ] 💻 Prem Copilot
- [ ] 🎵 Prem Audio
- [ ] 📷 Prem Vision
- [ ] 📖 Prem Summary
- [ ] 🖼️ Prem Upscaler
- [ ] 📹 Prem Video

## Contributing to Prem App

### Run the app with Tauri

```bash
npm i
npm run tauri dev
```

### Run the app with React

```bash
npm i
npm run dev
```
## Contributing to Prem Daemon
### Running the Daemon locally

```bash
git clone https://github.com/premAI-io/prem-daemon.git
cd ./prem-daemon

# create a python virtual environment and activate it
virtualenv venv -p=3.10
source ./venv/bin/activate

# install the necessary dependencies
pip install -r requirements.txt

# configure pre-commit hooks
pre-commit install

# run the webserver
cp .env.example .env
python main.py
```

### Mock Registry

In order to use the mock registry, you can specify the `REGISTRY_URL` environment variable as following:

```bash
PREM_REGISTRY_URL=https://raw.githubusercontent.com/premAI-io/prem-daemon/main/resources/mocks/manifests.json
```

### Running the test cases

```bash
pytest
```

### Release Checklist

- [ ] Create a tag with the new version in `prem-daemon` 
- [ ] Update the version in `prem-box` [here](https://github.com/premAI-io/prem-box/blob/main/versions.json)
- [ ] Create a tag with the new version in `prem-app`
- [ ] Update the version in `prem-box` [here](https://github.com/premAI-io/prem-box/blob/main/versions.json)

## Acknowledgments

Thank You ❤️

- [llama-cpp-python](https://github.com/abetlen/llama-cpp-python)
- [gpt4all](https://github.com/nomic-ai/gpt4all)
- [dolly-v2-12b](https://huggingface.co/databricks/dolly-v2-12b)
- [Open-Assistant](https://github.com/LAION-AI/Open-Assistant)
- [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [vicuna-7b](https://github.com/lm-sys/FastChat)
- [replit](https://huggingface.co/replit)
- [stabilityai](https://huggingface.co/stabilityai)
- [whisper](https://github.com/openai/whisper)
- [bark](https://github.com/bark-simulator/bark)
- [salesforce](https://github.com/salesforce/CodeT5)
- [redis](https://redis.com/solutions/use-cases/vector-database/)
- [qdrant](https://github.com/qdrant/qdrant)