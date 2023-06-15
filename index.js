const PORT=8000;
const express =  require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const e = require('express');

const app = express();
 
const climateArticles = [];

let climateNewsSources = [
    {
        name: 'Timef Of India',
        address: 'https://timesofindia.indiatimes.com/topic/climate-change',
        base:'',
        id:'timeofindia'
    },
    {
        name:'NDTV',
        address: 'https://www.ndtv.com/topic/climate-change',
        base:'',
        id:'ndtv'
    },
    {
        name:'Republic World',
        address:'https://www.republicworld.com/tags/climate-change',
        base:'',
        id:'republictv'
    },
    {
        name:'Hindusthan Times',
        address:'https://www.hindustantimes.com/ht-insight/climate-change',
        base:'https://www.hindustantimes.com',
        id:'hindusthantimes'
    },
    {
        name:'Indian Express',
        address:'https://indianexpress.com/section/world/climate-change/',
        base:'',
        id:'indianexpress'
    },
    {
        name:"The Statesman",
        address:"https://www.thestatesman.com/tag/climate-change",
        base:'',
        id:'thestatement'
    },
    {
        name:"The Telegraph",
        address:'https://www.telegraph.co.uk/climate-change/',
        base:'https://www.telegraph.co.uk',
        id:'thetelegraph'
    },
    {
        name:'The Hindu',
        address:'https://www.thehindu.com/sci-tech/energy-and-environment/',
        base:'',
        id:'thehindhu'
    },
    {
        name:'The New York Time',
        address:'https://www.nytimes.com/international/section/climate',
        base:'https://www.nytimes.com',
        id:'thenewyourktimes'
    },
    {
        name:"The Asian Age",
        address:'https://www.asianage.com/content/tags/climate-change',
        base:'https://www.asianage.com',
        id:'theasianage'
    }
]

//Get the news content for each sources 
climateNewsSources.forEach((newsopaper) =>{
    axios.get(newsopaper.address)
    .then((response) => {
        let html =  response.data;
        const $ =  cheerio.load(html);
        let climateContent1 = $('a:contains("climate")', html)
        let climateContent2 = $('a:contains("Climate")', html);
        let climateContent = climateContent1.add(climateContent2);
        climateContent.each(function(){
            let title = $(this).text();
            let url = $(this).attr('href');
            climateArticles.push({ 
                title,
                url:newsopaper.base + url,
                source:newsopaper.name
            })
       }) 
    })
})


app.get('/',  (req, res) =>{
    res.send('Welcome to my Climate change API')
})



app.get('/climate', (reg, res) => {
   res.json(climateArticles)
})

app.get('/climate/:id',(req, res) =>{
    let newspaperId = req.params.id;
    console.log(newspaperId)
    let newsPaper = climateNewsSources.filter(source => source.id === newspaperId)[0];
    console.log(newsPaper.address)
    let specificArticles = []
    // console.log(newspaperId)
    axios.get(newsPaper.address)
    .then((response) => {
        let html =  response.data;
        const $ =  cheerio.load(html);
        let climateContent1 = $('a:contains("climate")', html)
        let climateContent2 = $('a:contains("Climate")', html);
        let climateContent = climateContent1.add(climateContent2);
        climateContent.each(function(){
            let title = $(this).text();
            let url = $(this).attr('href');
            specificArticles.push({ 
                title,
                url:newsPaper.base + url,
                source:newsPaper.name
            }) 
       }) 
       res.json(specificArticles) 
    })
})

app.listen(PORT, () => { 
    console.log(`App is running on PORT : ${PORT}`)
})