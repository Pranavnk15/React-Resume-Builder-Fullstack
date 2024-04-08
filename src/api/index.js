import { collection, doc, onSnapshot, orderBy, setDoc, query, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

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


export const saveToCollections = async (user, data) => {
    if (!user?.collections?.includes(data?._id)) {
        const docRef = doc(db, "users", user?.uid)

        await updateDoc(docRef, {
            collections: arrayUnion(data?._id)
        })
            .then(() => toast.success("Saved To Collections"))
            .catch((err) => toast.error(`Error : ${err.message}`));
    } else {
        const docRef = doc(db, "users", user?.uid)

        await updateDoc(docRef, {
            collections: arrayRemove(data?._id)
        })
            .then(() => toast.success("Removed From Collections"))
            .catch((err) => toast.error(`Error : ${err.message}`));
    }
}

export const saveToFavourites = async (user, data) => {
    if (!data?.favourites?.includes(user?.uid)) {
        const docRef = doc(db, "templates", data?._id)

        await updateDoc(docRef, {
            favourites: arrayUnion(user?.uid),
        })
            .then(() => toast.success("Added To Favourites"))
            .catch((err) => toast.error(`Error : ${err.message}`));
    } else {
        const docRef = doc(db, "templates", data?._id)

        await updateDoc(docRef, {
            favourites: arrayRemove(user?.uid)
        })
            .then(() => toast.success("Removed From Favourites"))
            .catch((err) => toast.error(`Error : ${err.message}`));
    }
}


export const getTemplateDetails = async (templateId) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(doc(db, "templates", templateId), (doc) => {
            resolve(doc.data());
        });
        return unsubscribe;
    })
}


export const getTemplateDetailEditByUser = (uid, id) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
            doc(db, "users", uid, "resumes", id),
            (doc) => {
                resolve(doc.data());
            }
        );

        return unsubscribe;
    });
};

export const getSavedResumes = (uid) => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "users", uid, "resumes"),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);
        });
        return unsubscribe;
    })
}