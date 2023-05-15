const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const axios = require('axios');

require('dotenv').config();

// Mongoose setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected successfully to MongoDB server');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB server', error);
        process.exit(1);
    });

const friendsSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
});

const Friend = mongoose.model('Friend', friendsSchema);

app.set('view engine', 'hbs');
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));

app.get('/', async function (request, response) {
    try {
        const dataTeman = await Friend.find({});
        response.render('index', { dataTeman });
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

app.get('/data', async function (request, response) {
    try {
        const dataTeman = await Friend.find({});
        const maleCount = dataTeman.filter((friend) => friend.gender === 'Male').length;
        const femaleCount = dataTeman.filter((friend) => friend.gender === 'Female').length;
        const totalFriends = dataTeman.length;
        const ageBelow19Count = dataTeman.filter((friend) => friend.age <= 19).length;
        const ageAbove19Count = dataTeman.filter((friend) => friend.age > 19).length;

        const malePercentage = (maleCount / totalFriends) * 100;
        const femalePercentage = (femaleCount / totalFriends) * 100;
        const ageBelow19Percentage = (ageBelow19Count / totalFriends) * 100;
        const ageAbove19Percentage = (ageAbove19Count / totalFriends) * 100;

        const chartData = {
            labels: ['Male', 'Female', 'Age <= 19', 'Age > 19'],
            datasets: [
                {
                    label: 'Percentage',
                    backgroundColor: ['#2d33e6', '#cd3cd7', '#42a5f5', '#ff4081'],
                    data: [malePercentage, femalePercentage, ageBelow19Percentage, ageAbove19Percentage],
                },
            ],
        };

        response.json({ dataTeman, chartData });
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

app.post('/', async function (request, response) {
    try {
        const { name, gender, age } = request.body;
        const card = new Friend({
            name: name,
            age: age,
            gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        });
        await card.save();
        response.redirect('/');
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal Server Error');
    }
});

app.listen(port, function () {
    console.log(`Server running on port ${port}`);
});
