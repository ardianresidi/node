const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));


// Middleware for parsing form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the respiratory.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/respiratory', (req, res) => {
    res.sendFile(path.join(__dirname, 'respiratory.html'));
});


// Serve the results page
app.get('/results', (req, res) => {
    const data = JSON.parse(decodeURIComponent(req.query.data));

    if (!data) {
        return res.status(400).send("No data found. Please submit the form first.");
    }

    // Extract relevant data from form
    const age = parseInt(data.age);
    const smokingStatus = data.smokingStatus;
    const pefr = parseFloat(data.pefr);
    const fev1 = parseFloat(data.fev1);
    const fvc = parseFloat(data.fvc);
    const fev1_fvc_ratio = parseFloat(data.fev1_fvc_ratio);
    const cough = data.cough;
    const wheezing = data.wheezing;
    const shortness_of_breath = data.shortness_of_breath;
    const chest_pain = data.chest_pain;

    // Basic risk assessment based on the data
    let riskLevel = 'Low';
    let advice = 'Your respiratory health seems normal based on the data provided.';

    // Risk Assessment Logic

    let finalAdvice = '';  // Variable to store the final advice

    // Age Factor: Older individuals may have higher risk
    if (age > 60) {
        riskLevel = 'Medium';
        finalAdvice = 'As you are over 60, your respiratory risk may be higher. Regular check-ups are recommended.';
    } 
    // Smoking Factor: Smokers are at higher risk for respiratory diseases
    else if (smokingStatus === 'Smoker') {
        riskLevel = 'High';
        finalAdvice = 'Smoking significantly increases the risk of respiratory diseases like COPD and lung cancer. Consider quitting and consult a doctor.';
    } 
    // PEFR, FEV1, FVC, FEV1/FVC Ratio: Values indicating lung function
    else if (fev1 < 80 || fvc < 80 || fev1_fvc_ratio < 0.7) {
        riskLevel = 'High';
        finalAdvice = 'The values for FEV1, FVC, and FEV1/FVC ratio suggest potential lung function impairment. Please consult a healthcare provider.';
    } 
    // Symptoms check: Cough, wheezing, shortness of breath, chest pain are signs of respiratory issues
    else if (cough === 'Chronic' || wheezing === 'Yes' || shortness_of_breath === 'Yes' || chest_pain === 'Yes') {
        riskLevel = 'High';
        finalAdvice = 'Your symptoms (cough, wheezing, shortness of breath, chest pain) suggest a need for medical evaluation. Please see a doctor as soon as possible.';
    } 
    // If none of the above conditions match, this will be the fallback advice
    else {
        riskLevel = 'Low';
        finalAdvice = 'You have a low risk for respiratory issues, but continue maintaining a healthy lifestyle and monitor your health.';
    }
    
    // Print only the final advice
    console.log(finalAdvice);
    
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Risk Assessment</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            display: flex;
            min-height: 100vh;
        }

        /* Left Menu Styles */
        .left-menu {
            width: 250px;
            background-color: #2c3e50;
            color: #ecf0f1;
            height: 100vh;
            position: fixed;
            display: flex;
            flex-direction: column;
            padding: 20px 0;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .menu-title {
            text-align: center;
            font-size: 1.8em;
            font-weight: bold;
            margin-bottom: 20px;
            border-bottom: 2px solid #34495e;
            padding-bottom: 10px;
            color: #1abc9c;
        }

        .menu-item {
            padding: 15px 20px;
            margin: 5px 0;
            cursor: pointer;
            text-decoration: none;
            color: #ecf0f1;
            font-size: 1em;
            transition: all 0.3s ease-in-out;
            border-left: 5px solid transparent;
        }

        .menu-item:hover {
            background-color: #34495e;
            border-left: 5px solid #1abc9c;
        }

        .menu-item:active {
            background-color: #1abc9c;
            color: #2c3e50;
        }

        /* Main Content Styles */
        .content {
            margin-left: 260px;
            padding: 30px;
            width:50%;
            flex: 1;
            background-color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
         
        }

        .content h3 {
            font-size: 2.5em;
            color: #2c3e50;
            margin-bottom: 15px;
        }

        .content p {
            font-size: 1.2em;
            line-height: 1.6;
            color: #7f8c8d;
        }

        .content .risk-level {
            font-size: 1.5em;
            font-weight: bold;
            color: #e67e22; /* Orange for medium risk */
        }

        .content .risk-level.high {
            color: #e74c3c; /* Red for high risk */
        }

        .content .risk-level.low {
            color: #27ae60; /* Green for low risk */
        }

        .content p:last-child {
            margin-top: 20px;
            border-top: 1px solid #dcdcdc;
            padding-top: 15px;

             /* Back Button */
        .back-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 1em;
            color: #ffffff;
            background-color: #1abc9c;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .back-button:hover {
            background-color: #16a085;
        }
        }
    </style>
</head>
<body>
    <!-- Left Menu -->
    <div class="left-menu">
        <div class="menu-title">Care +</div>
        <a href="/" class="menu-item">Home</a>
        <a href="cardio.html" class="menu-item">Predict Cardiovascular Disease</a>
        <a href="diabetes.html" class="menu-item">Predict Diabetes</a>
        <a href="respiratory.html" class="menu-item">Predict Respiratory Disease</a>
       
        <a href="contact.html" class="menu-item">Contact</a>
    </div>

    <!-- Main Content -->
    <div class="content">
        <h3>Risk Assessment</h3>
        <p>Risk Level: <span class="risk-level ${riskLevel.toLowerCase()}">${riskLevel}</span></p>
        <p>${finalAdvice}</p>
        <button class="back-button" onclick="history.back()">Back</button>
    </div>
</body>
</html>
`;

res.send(htmlContent);

});

// Function to get the location ID based on the city
function getLocationId(city) {
    switch (city) {
        case 'Tetovo':
            return 2163058;
        case 'Prilep':
            return 2163060;
        case 'Kumanovo':
            return 2918;
        case 'Gazi Baba':
            return 2919;
        case 'Lisice':
            return 2976;
        case 'Karpos':
            return 2977;
        case 'Gevgelija':
            return 2163050;
        case 'Gostivar':
            return 2163059;
        default:
            throw new Error('City not found');
    }
}
const csvFilePath = path.resolve('/tmp/respiratory_data.csv'); // Use '/tmp' for temporary files

console.log('Attempting to write data to CSV');
console.log('File Path:', csvFilePath);


// CSV file setup
//const csvFilePath = path.join(__dirname, 'respiratory_data.csv');


// Function to check if the CSV file exists and add headers if needed
function ensureCsvHeaders() {
    if (!fs.existsSync(csvFilePath)) {
        const headers = "Age,Gender,SmokingStatus,City,perf,fev1,fvc,fev1_fvc_ratio,Condition,Medication,AllergyStatus,AirPollution,PM10,NO2,SO2,PM25,O3\n";
        fs.writeFileSync(csvFilePath, headers);
    } else {
        const fileContents = fs.readFileSync(csvFilePath, 'utf8');
        if (!fileContents.startsWith("Age,Gender,SmokingStatus,City,perf,fev1,fvc,fev1_fvc_ratio,Condition,Medication,AllergyStatus,AirPollution,PM10,NO2,SO2,PM25,O3")) {
            const headers = "Age,Gender,SmokingStatus,City,perf,fev1,fvc,fev1_fvc_ratio,Condition,Medication,AllergyStatus,AirPollution,PM10,NO2,SO2,PM25,O3\n";
            fs.writeFileSync(csvFilePath, headers + fileContents);
        }
    }
}

// Ensure CSV headers are added at the start
ensureCsvHeaders();

// POST route to handle form submission
app.post('/sufev1_fvc_ratiot', async (req, res) => {
    try {
        const {
            age, gender, smokingStatus, city, pefr, fev1, fvc, fev1_fvc_ratio, cough, wheezing,
            shortness_of_breath, chest_pain, past_infections, family_history, air_quality, 
            living_conditions, physical_activity
        } = req.body;

        const locationId = getLocationId(city); 
        const apiUrl = `https://api.openaq.org/v2/locations/${locationId}?limit=1000`;
        const apiKey = process.env.OPENAQ_API_KEY;

        const apiHeaders = {
            "x-api-key": "b77f00d01a26e10d71d1a8ba139c4df451e644ebca42d0519592b9b7eadfaee2"
        };

        const response = await axios.get(apiUrl, { headers: apiHeaders });
        const results = response.data.results[0].parameters;

        const pm10 = results.find(p => p.parameter === "pm10")?.average?.toFixed(2) || "N/A";
        const no2 = results.find(p => p.parameter === "no2")?.average?.toFixed(2) || "N/A";
        const so2 = results.find(p => p.parameter === "so2")?.average?.toFixed(2) || "N/A";
        const pm25 = results.find(p => p.parameter === "pm25")?.average?.toFixed(2) || "N/A";
        const o3 = results.find(p => p.parameter === "o3")?.average?.toFixed(2) || "N/A";

        const csvData = `${age},${gender},${smokingStatus},${city},${pefr},${fev1},${fvc},${fev1_fvc_ratio},${cough},${wheezing},${shortness_of_breath},${chest_pain},${past_infections},${family_history},${air_quality},${pm10},${no2},${so2},${pm25},${o3}\n`;
       // fs.appendFileSync(csvFilePath, csvData);

       
       fs.appendFileSync(csvFilePath, csvData, (err) => {
        if (err) console.error('File write error:', err);
    });

    
        res.redirect(`/results?data=${encodeURIComponent(JSON.stringify(req.body))}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the form.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
