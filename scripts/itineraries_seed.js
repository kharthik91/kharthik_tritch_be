require('dotenv').config()
const { MongoClient } = require("mongodb")
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
const connectionStr = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
const client = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})



const itinerariesData = [{"name":"Algiers","destination":"Darungan","season":"Fall","trip_duration":14,"creator":"Victoir"},
{"name":"Operación Cannabis","destination":"Aracaju","season":"Fall","trip_duration":16,"creator":"Anissa"},
{"name":"Our Town","destination":"Poroçan","season":"Spring","trip_duration":26,"creator":"Celestine"},
{"name":"Yes: 9012 Live","destination":"Sakaraha","season":"Summer","trip_duration":30,"creator":"Berne"},
{"name":"American Nightmare, The","destination":"Dalsjöfors","season":"Fall","trip_duration":11,"creator":"Issiah"},
{"name":"Steel Trap, The","destination":"Najd al Jumā‘ī","season":"Winter","trip_duration":10,"creator":"Licha"},
{"name":"Girl on the Train, The","destination":"Kidričevo","season":"Winter","trip_duration":8,"creator":"Ronnie"},
{"name":"The Child and the Policeman","destination":"Chernelytsya","season":"Fall","trip_duration":21,"creator":"Elvyn"},
{"name":"Under the Sand","destination":"Borås","season":"Summer","trip_duration":25,"creator":"Kinna"},
{"name":"Nice Guys Sleep Alone","destination":"Pyetrykaw","season":"Fall","trip_duration":9,"creator":"Maire"},
{"name":"Krakatoa: The Last Days","destination":"Khulm","season":"Fall","trip_duration":19,"creator":"Franz"},
{"name":"Northfork","destination":"Odrinhas","season":"Winter","trip_duration":3,"creator":"Johnathon"},
{"name":"I'm All Right Jack","destination":"Al Ḩusayn","season":"Spring","trip_duration":22,"creator":"Valentia"},
{"name":"Django 2: Django Strikes Again","destination":"Dukuhpicung","season":"Summer","trip_duration":7,"creator":"Aylmer"},
{"name":"St Trinian's 2: The Legend of Fritton's Gold","destination":"Xialu","season":"Winter","trip_duration":12,"creator":"Sheila-kathryn"},
{"name":"In Your Dreams (Dans tes rêves)","destination":"Charlotte","season":"Winter","trip_duration":17,"creator":"Tremain"},
{"name":"Amityville Horror, The","destination":"Sumbersari Wetan","season":"Fall","trip_duration":29,"creator":"Yehudi"},
{"name":"My Brother's Wife (Mujer de mi hermano, La)","destination":"San Diego","season":"Summer","trip_duration":27,"creator":"Polly"},
{"name":"Guilty as Sin","destination":"Luklukan","season":"Spring","trip_duration":1,"creator":"Michail"},
{"name":"Pooh's Grand Adventure: The Search for Christopher Robin","destination":"Maticmatic","season":"Winter","trip_duration":7,"creator":"Amos"},
{"name":"Missing in Action","destination":"Tuapse","season":"Summer","trip_duration":1,"creator":"Hill"},
{"name":"It Runs in the Family","destination":"Suzhou","season":"Winter","trip_duration":17,"creator":"Pearle"},
{"name":"Next Stop, Greenwich Village","destination":"Tpig","season":"Fall","trip_duration":30,"creator":"Margaretta"},
{"name":"Futurama: Bender's Big Score","destination":"Hepu","season":"Winter","trip_duration":7,"creator":"Katerine"},
{"name":"Live from Baghdad","destination":"Ichnya","season":"Winter","trip_duration":12,"creator":"Marty"},
{"name":"In Bloom (Grzeli nateli dgeebi)","destination":"Pawili","season":"Winter","trip_duration":10,"creator":"Beaufort"},
{"name":"Cemetery Club, The","destination":"Dzwola","season":"Fall","trip_duration":27,"creator":"Fons"},
{"name":"Gidget","destination":"San Isidro","season":"Fall","trip_duration":2,"creator":"Donalt"},
{"name":"Incredible Shrinking Woman, The","destination":"Sheshan","season":"Winter","trip_duration":25,"creator":"Christoffer"},
{"name":"High Plains Drifter","destination":"Belene","season":"Spring","trip_duration":30,"creator":"Caryl"},
{"name":"Where the Truth Lies","destination":"Mopti","season":"Summer","trip_duration":23,"creator":"Siana"},
{"name":"Heart of Glass (Herz aus Glas)","destination":"Tempeh Tengah","season":"Spring","trip_duration":24,"creator":"Chaunce"},
{"name":"Written on the Wind","destination":"Mukařov","season":"Fall","trip_duration":22,"creator":"Rheba"},
{"name":"Walker, The","destination":"Dampit Satu","season":"Fall","trip_duration":10,"creator":"Beaufort"},
{"name":"Dark Blue","destination":"Burgaltay","season":"Spring","trip_duration":18,"creator":"Malinde"},
{"name":"Shanghai Kiss","destination":"Kabare","season":"Fall","trip_duration":18,"creator":"Leilah"},
{"name":"Trishna","destination":"Zakamensk","season":"Winter","trip_duration":8,"creator":"Logan"},
{"name":"Gorky Park","destination":"Niigata-shi","season":"Summer","trip_duration":10,"creator":"Mose"},
{"name":"Smiling Fish and Goat on Fire","destination":"Chervonopartyzans’k","season":"Winter","trip_duration":13,"creator":"Stephani"},
{"name":"Tokyo Zombie (Tôkyô zonbi)","destination":"Dongshui","season":"Summer","trip_duration":7,"creator":"Janaye"},
{"name":"Dark Lurking, The","destination":"Calbuco","season":"Fall","trip_duration":2,"creator":"Chariot"},
{"name":"Star Trek: Nemesis","destination":"Zhovti Vody","season":"Winter","trip_duration":10,"creator":"Colin"},
{"name":"Digging to China","destination":"Břeclav","season":"Summer","trip_duration":1,"creator":"Ginger"},
{"name":"Child Is Waiting, A","destination":"Kŭlob","season":"Fall","trip_duration":2,"creator":"Ertha"},
{"name":"Tuvalu","destination":"Kauswagan","season":"Winter","trip_duration":21,"creator":"Ambros"},
{"name":"Babyfever","destination":"Rožna Dolina","season":"Winter","trip_duration":5,"creator":"Skyler"},
{"name":"Casino Royale","destination":"Gao","season":"Summer","trip_duration":24,"creator":"Sydney"},
{"name":"Anne of Green Gables","destination":"Falefa","season":"Spring","trip_duration":16,"creator":"Salomi"},
{"name":"July Rhapsody (Laam yan sei sap)","destination":"Legen","season":"Winter","trip_duration":28,"creator":"Tresa"},
{"name":"Fighting Sullivans, The (Sullivans, The)","destination":"Heqiao","season":"Summer","trip_duration":12,"creator":"Stephani"}]


// connect to mongodb
client.connect()
    .then(connectedClient => {
        // connection successful

        // get db and collection references
        const db = connectedClient.db('tritch')
        const itinerariesCollection = db.collection('itineraries')

        // insert data
        itinerariesCollection.insertMany(itinerariesData)
            .then(insertResp => {
                console.log(insertResp)
                console.log('insert successful')
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                connectedClient.close()
            })
    })
    .catch(err => {
        // handle err if connection fails
        console.log(err)
    })