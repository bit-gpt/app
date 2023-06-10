# [Prem](https://premai.io) - Self Sovereign AI Infrastructure. 

<img width="1500" alt="Logo" src="https://github.com/premAI-io/prem-app/assets/29598954/9fb2e2b5-89e8-40c9-a66f-eb20f6b00584">

## Demo

https://github.com/premAI-io/prem-app/assets/29598954/856af04d-bded-423e-8e90-1e891ec6824f

## Installation

Download the latest version of the app from [here](https://github.com/premAI-io/prem-app/releases/tag/v0.0.10).

Otherwise, you can install Prem on your server by running the following command:

```bash
wget -q https://get.prem.ninja/install.sh -O install.sh; sudo bash ./install.sh
```

If you have problems with the installer script, you can run Prem directly with docker-compose.

```bash
git clone https://github.com/premAI-io/prem-app.git
cd ./prem-app
docker-compose up -d
```

> We suggest to use the installer script if you have a fresh machine, because it will install all the necessary dependencies.

If you have a GPU 

```bash
git clone https://github.com/premAI-io/prem-app.git
cd ./prem-app
docker-compose up -f docker-compose.yml -f docker-compose.gpu.yml -d
```

## Product Roadmap

If you wanna know which services we support for each interface, please refer to Prem Registry https://premai-io.github.io/prem-registry-ui/.

### Interfaces

- [x] 😃 Prem Chat
- [x] 📕 Prem Embeddings
- [x] 🏛️ Prem Store
- [ ] 🎨 Prem Diffusion
- [ ] 💻 Prem Copilot
- [ ] 🎵 Prem Text to Audio
- [ ] 🎵 Prem Audio to Text
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

> The mock registry is not fully tested. Few interfaces could be broken.

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
