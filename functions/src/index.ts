const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export const isUpdate = functions.https.onRequest((req, res) => {
    const appId = req.query.appId;
    const nowVersion = req.query.nowVersion;

    const app = db.collection('apps').doc(appId);
    app.get().then(snapshot => {
        const data = snapshot.data();
        let have2Update = data.minimumVersion > nowVersion;
        // console.log("updateVersions");
        // console.log(data.updateVersions);

        data.updateVersions.forEach(element => {
            // console.log("element = " + element + ". isSame? " + element == nowVersion);
            if (element == nowVersion) have2Update = true;
        });
        res.status(200).json(new Response(have2Update, nowVersion)).end();
    }).catch(error => {
        res.status(500).end();
    });
})

class Response {
    isUpdate: boolean;
    nowVersion: number;
    constructor(isUpdate: boolean, nowVersion: number) {
        this.isUpdate = isUpdate;
        this.nowVersion = nowVersion
    }
}