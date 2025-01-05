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
    

    // Final Output
    const htmlContent = `
        <html>
          <head>
        <style>
            /* General Page Style */
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
                line-height: 1.6;
            }

            /* Title Styling */
            h2 {
                text-align: center;
                color: #333;
                font-size: 2rem;
                margin: 20px 0;
            }

            h3 {
                text-align: center;
                color: #555;
                font-size: 1.5rem;
            }

            /* Table Styling */
            table {
                width: 80%;
                margin: 30px auto;
                border-collapse: collapse;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            /* Table Header Styling */
            th {
                background-color: #4CAF50;
                color: white;
                padding: 12px 20px;
                text-align: left;
                font-size: 1.1rem;
                text-transform: uppercase;
            }

            /* Table Data Cell Styling */
            td {
                padding: 12px 20px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }

            /* Table Row Hover Effect */
            tr:hover {
                background-color: #f1f1f1;
            }

            /* Table Border Styling */
            table, th, td {
                border: 1px solid #ddd;
            }

            /* Risk Assessment Section */
            p {
                text-align: center;
                font-size: 1.2rem;
                margin-top: 20px;
            }

            .risk-level {
                font-weight: bold;
                font-size: 1.4rem;
                color: #d9534f;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                table {
                    width: 90%;
                }
                th, td {
                    padding: 8px;
                    font-size: 0.9rem;
                }
            }
        </style>
    </head>
    <body>
        <h2>Your Submitted Data</h2>
        <table>
            <tr>
                <th>City</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Smoking Status</th>
                <th>PEFR</th>
                <th>FEV1</th>
                <th>FVC</th>
                <th>FEV1/FVC Ratio</th>
                <th>Cough</th>
                <th>Wheezing</th>
                <th>Shortness of Breath</th>
                <th>Chest Pain</th>
                <th>Past Infections</th>
                <th>Family History</th>
                <th>Air Quality</th>
                <th>Living Conditions</th>
                <th>Physical Activity</th>
            </tr>
            <tr>
                <td>${data.city}</td>
                <td>${data.age}</td>
                <td>${data.gender}</td>
                <td>${data.smokingStatus}</td>
                <td>${data.pefr}</td>
                <td>${data.fev1}</td>
                <td>${data.fvc}</td>
                <td>${data.fev1_fvc_ratio}</td>
                <td>${data.cough}</td>
                <td>${data.wheezing}</td>
                <td>${data.shortness_of_breath}</td>
                <td>${data.chest_pain}</td>
                <td>${data.past_infections}</td>
                <td>${data.family_history}</td>
                <td>${data.air_quality}</td>
                <td>${data.living_conditions}</td>
                <td>${data.physical_activity}</td>
            </tr>
        </table>
        <h3>Risk Assessment</h3>
        <p>Risk Level: <span class="risk-level">${riskLevel}</span></p>
        <p>${finalAdvice}</p>
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

// CSV file setup
const csvFilePath = path.join(__dirname, 'respiratory_data.csv');

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
        fs.appendFileSync(csvFilePath, csvData);

        res.redirect(`/results?data=${encodeURIComponent(JSON.stringify(req.body))}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the form.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
