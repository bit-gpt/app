# Prem App ❤️

> Note: this repository is the main user interface to interact with ai-box. Please refer to https://github.com/premAI-io/prem-box for a more complete documentation.

## Demo

`HERE_VIDEO_AND_DOWNLOAD_LINKS`

## Getting Started

### Run the Backend

```bash
# clone the backend repo
git clone git@github.com:premAI-io/prem-box.git

# change directory and run the backend with docker-compose
cd ./prem-box/
docker-compose up --build -d controller
```
### Run the app with Tauri

```bash
npm i
npm run tauri dev
```

### Run the app with React

```bash
npm i
npm run start
```