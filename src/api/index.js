import { collection, doc, onSnapshot, orderBy, setDoc, query } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";


// // we are creating a new promise and we are using onAuthStateCHanges creating n unsubscribed 
// event outside and we are making sure on using onAuthState we are getting usercredentials or not
// if we have usercredentials, then we need to make sure wheather the loggedin user is already registered or not 
// i.e wheather the data is inside the collection or not, by using the doc property we are trying to fetch that user information
// by using that ID, if that id already exists then we are sending that data, else we are creating a new user for that specific id and we are supplying
// that user data to store it in oour collection then we are sending it back, then we stop the inner and outer listerner events
export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                const userData = userCred.providerData[0];
                // console.log(userData);
                const unsubscribe = onSnapshot(doc(db, "users", userData?.uid), (_doc) => {
                    if (_doc.exists()) {
                        resolve(_doc.data())
                    } else {
                        setDoc(doc(db, "users", userData?.uid), userData).then(() => {
                            resolve(userData);
                        })
                    }
                })
                return unsubscribe;
            } else {
                reject(new Error("User is not authenticated"))
            }

            //make sure to unsubscriber from the listerner to prevent the memory leaks
            unsubscribe();
        })
    })
}


export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "templates"),
            orderBy("timestamp", "asc")
        )

        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);
        });

        return unsubscribe;
    })
}