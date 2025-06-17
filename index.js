const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/forecast', async (req, res) => {
    const city = req.query.city;
    const lang = req.query.lang;
    const weatherApiKey = process.env.OPENWEATHER_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!city) {
        return res.status(400).json({ error: 'Cidade não especificada!' });
    }

    try {
        const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: city,
                appid: weatherApiKey,
                units: 'metric',
                lang: lang
            }
        });

        const weatherData = weatherResponse.data;

        const googleResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: googleApiKey,
                cx: searchEngineId,
                searchType: 'image',
                imgSize: 'large',
                num: 1,
                q: `imagem da cidade de ${city}`
            }
        });

        const imageUrl = googleResponse.data.items && googleResponse.data.items.length > 0
            ? googleResponse.data.items[0].link
            : null;

        res.json({
            weather: weatherData,
            image: imageUrl
        });

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error when searching for information' });
    }
});

app.get('/', (req, res) => {
    res.send('API Weather Forecast is working!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
