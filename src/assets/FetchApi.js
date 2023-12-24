import  axios  from 'axios';
// const BASE_URL = 'https://youtube-v38.p.rapidapi.com'
// import express from 'express'   //generates error becoz using backend(node)
// import cors from 'cors'       //https://cors-anywhere.herokuapp.com
// const app = express()

 const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY
const options = {
    params: {
        maxResults: '50'
    },
    headers: {
        //to add .env variables in vite
        'X-RapidAPI-Key': {key},
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
    }
};
export const fetchApi = async (url) => {
  try {
    const { data } = await axios.get(`${url}`, options);
    if (data ) {
      return data;
    } else {
      console.error('Error: data or data.items is undefined');
      // Handle the error appropriately in your application
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    // Handle the error appropriately in your application
  }
};

//no need becoz used fetche directly in feed but can try this way sometime