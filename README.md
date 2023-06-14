<img width="1024" alt="Logo" src="https://github.com/premAI-io/prem-app/assets/29598954/9fb2e2b5-89e8-40c9-a66f-eb20f6b00584">

# 🤖 Prem - Self Sovereign AI Infrastructure

[![Version](https://img.shields.io/github/v/release/premAI-io/prem-app?color=%235351FB&label=version)](https://github.com/premAI-io/prem-app/releases)
[![Release](https://github.com/premAI-io/prem-app/actions/workflows/on-tag.yaml/badge.svg?event=push)](https://github.com/premAI-io/prem-app/actions/workflows/on-tag.yaml)
[![Twitter](https://img.shields.io/twitter/follow/premai_io?style=social)](https://twitter.com/premai_io)
[![Discord](https://dcbadge.vercel.app/api/server/WkBkzVEp?style=social)](https://discord.com/invite/WkBkzVEp)


Prem provides a unified environment to develop AI applications and deploy AI models on your infrastructure. Abstracting away all technical complexities for AI deployment and ushering in a new era of privacy-centric AI applications - users can finally retain control and ownership of their models. 

## 🚀 Getting started

- Install Prem on your MacOS (16GB+ RAM required) - [Dowload the latest Prem App](https://github.com/premAI-io/prem-app/releases)
- Install Prem on your Linux sever (Ubuntu,Debian) - [Installer script](#install-on-linux)
- Try out on the live demo instance - [app.prem.ninja](https://app.prem.ninja)

## Demo

https://github.com/premAI-io/prem-app/assets/29598954/856af04d-bded-423e-8e90-1e891ec6824f

## Install on Linux

Install everything needed to run Prem on Ubuntu/Debian server

```bash
wget -q https://get.prem.ninja/install.sh -O install.sh; sudo bash ./install.sh
```
------

If you encounter issues or you want to build the Prem App docker image inside your Linux server

### CPU 
```bash
git clone https://github.com/premAI-io/prem-app.git
cd ./prem-app
docker-compose up -d
```

### GPU 
```bash
git clone https://github.com/premAI-io/prem-app.git
cd ./prem-app
docker-compose up -f docker-compose.yml -f docker-compose.gpu.yml -d
```

## Product Roadmap

The AI services expose an HTTP API interface, standardized for their interface type. For example, all models of type `Chat` expose the OpenAI API for easy of integration of existing tool and AI app ecosystem.
Each service we support it's published on the [Prem Registry](https://premai-io.github.io/prem-registry-ui). 

> Anyone can prepare, package and publish an AI service on Prem. Instructions coming soon.

### Interfaces

- [x] 😃 Chat
- [x] 📕 Embedding
- [x] 🏛️ Vector Store
- [ ] 🎨 Diffuser
- [ ] 💻 Coder
- [ ] 🎵 Text to Audio
- [ ] 🎵 Audio to Text
- [ ] 📷 Vision
- [ ] 📖 Summary
- [ ] 🖼️ Upscaler
- [ ] 📹 Video

## Contributing

### Run the app with Tauri

> Make sure to remove any value in the `.env` file.

```bash
npm i
npm run tauri dev
```

### Run the app with React

```bash
# run the daemon
docker-compose up -d premd

# copy .env.example file in .env
cp .env.example

npm i
npm run dev
```

### Environment Variables

- `VITE_BACKEND_URL` : destination of the premd
- `VITE_DESTINATION` : `browser` | `desktop`
- `IS_PACKAGED` : `true` | `false` used for server packaging.

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
