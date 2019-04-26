const express = require('express');
const router = express.Router();


const admin = require('firebase-admin');
var serviceAcc = require("serviceKey.json");



admin.initializeApp({
    credential: admin.credential.cert(serviceAcc),
})



const db = admin.firestore();
    
const userCollection = db.collection("Users");
const paymentCollection = db.collection("payment");



router.get("/pending", (req, res, next) => {

    let allUsers = [];
    let allUserData = [];

    userCollection.get()
        .then(snapshot => {


            snapshot.forEach(doc => {

                allUsers.push(doc.id);

                allUserData = snapshot.docs.map(flattenDoc2);
            });
            function flattenDoc2(doc) {

                return { id: doc.id, ...doc.data() }

            }


            let allPayout = [];
            let totalSum = 0;
            for (i = 0; i < allUsers.length; i++) {

                let userId = allUsers[i]

                userCollection.doc(userId).collection('payout').get()
                    .then(snapshot2 => {
                       
                        if (!snapshot2.empty && userId != "4ADAN8FZ8EethW6ZBg9jrPNcNtj2" && userId != "0Es8vSiOSDX8PPDfoOEIH6Y2H343" && userId != "iy57glvFOLbUMlAEkViZdqgvwno1" && userId != "3Az2KJbXyHR48166mdTj5vRnUVX2" && userId != "A1NWsMhJLfa5pS8ApHd5BI5HfCd2") {

                            let values = snapshot2.docs.map(flattenDoc);
                            // values[k].payoutRequestDate.toLocaleDateString() == "10/7/2018"

                            // console.log(str.substring(0, 3));
                            for (k = 0; k < values.length; k++) {

                                if (values[k].payoutRequestDate.toLocaleDateString().substring(0, 3) == "11/"  && values[k].payoutStatus == false) {


                                    if (Number.isInteger(values[k].payoutAmount))
                                    {
                                        totalSum = totalSum + values[k].payoutAmount;


                                    }


                                    }

                            }

                        }
                        console.log(totalSum)
                    })

                function flattenDoc(doc) {

                    return { id: doc.id, ...doc.data() }

                }

                if (i == userId.length - 1) {

                    res.json({
                        "statusCode": "200",
                        "statusResponse": "ok",
                        "messege": " found",
                        "data": allPayout
                    })

                }

            };

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });



    // userCollection.doc(userId).collection('payout').get()
    //     .then(snapshot => {
    //         const values = snapshot.docs.map(flattenDoc);
    //         console.table(values);
    //         res.json({
    //             "statusCode": "200",
    //             "statusResponse": "ok",
    //             "messege": userId + " found",
    //             "data": values
    //         })
    //     })

    // function flattenDoc(doc) {
    //     return { id: doc.id, ...doc.data() }
    // }
})



router.get("/totalpay", (req, res, next) => {
    let allUsers = [];
    paymentCollection.get()
        .then(snapshot => {
            let totalSum=0;

            snapshot.forEach(doc => {
                // console.log(doc.data().amountToBeCredited)

                if (Number.isInteger(doc.data().amountToBeCredited)){

                    totalSum = totalSum + doc.data().amountToBeCredited;
                }
                   


            });
            console.log("payment ="+totalSum)
            res.json({
                "statusCode": "200",
                "statusResponse": "ok",
                "messege": "All users",
                "data": totalSum
            })
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
})

router.get("/paytwo", (req, res, next) => {


    let documents = userCollection.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                // console.log("Parent Document ID: ", doc.id);
                
                let subCollectionDocs = userCollection.doc(doc.id).collection("conversion").get()
                    .then(snapshot => {

                        userCollection.doc(doc.id).collection("payout").get().then(snapshot3 => {
                            
                            userCollection.doc(doc.id).get().then(doc4 => {
                                
                                let a1 = [];
                                let a2 = [];
                                snapshot3.forEach(doc3 => {
                                    // console.log(doc3.data().payoutAmount)

                                    a2.push(doc3.data().payoutAmount)
                                    // console.log(doc.data().totalBalance)
                                })


                                snapshot.forEach(doc2 => {
                                    // console.log(doc2.data().price)
                                    a1.push(doc2.data().price)

                                })

                                
                                

                                a2.push(doc4.data().totalBalance)
                                var sum1 = a1.reduce((a, b) => a + b, 0);
                                var sum2 = a2.reduce((c, d) => c + d, 0);
                                if (sum1 != sum2) {

                                    console.log(doc.id)
                                }



                            })
                        })

                        
                       
                    }).catch(err => {
                        console.log("Error getting sub-collection documents", err);
                    })
            });
        }).catch(err => {
            console.log("Error getting documents", err);
        });

    


})



router.get("/payone", (req, res, next) => {


    let documents = userCollection.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                // console.log("Parent Document ID: ", doc.id);
                let a = [];
                let subCollectionDocs = userCollection.doc(doc.id).collection("conversion").get()
                    .then(snapshot => {
                        snapshot.forEach(doc2 => {
                            // console.log(doc2.data().orderId)
                            a.push(doc2.data().orderId)

                            var uniq = a
                                .map((name) => {
                                    return { count: 1, name: name }
                                })
                                .reduce((a, b) => {
                                    a[b.name] = (a[b.name] || 0) + b.count
                                    return a
                                }, {})

                            var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)

                            if(duplicates.length!=0){
                                // console.log(duplicates)
                                console.log(doc.id)
                            }
                          

                        

                        })
                    }).catch(err => {
                        console.log("Error getting sub-collection documents", err);
                    })
            });
        }).catch(err => {
            console.log("Error getting documents", err);
        });


})



router.get("/users", (req, res, next) => {
    let allUsers = [];
    userCollection.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                allUsers.push({
                    "docID": doc.id,
                    "userDate": doc.data()
                });
            });
            console.log(allUsers)
            res.json({
                "statusCode": "200",
                "statusResponse": "ok",
                "messege": "All users",
                "data": allUsers
            })
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
})


router.get("/users/:id", (req, res, next) => {
    let reqId = req.params.id;
    userCollection.doc(reqId).get()
        .then(doc => {
            if (doc.exists) {
                res.json({
                    "statusCode": "200",
                    "statusResponse": "ok",
                    "messege": "User Found",
                    "userdata": doc.data()
                });
            } else {
                res.json({
                    "statusCode": "404",
                    "statusResponse": "Not found",
                    "messege": "User not Found"
                })
            }
        }).catch(err => {
            console.log(err);
        })
})



/* workingg */
router.get("/users/email/:id", (req, res, next) => {
    let reqId = req.params.id;

    userCollection.where('email', '==', reqId).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let usereid = [];
                usereid.push({
                    "docID": doc.id,
                    "userDate": doc.data()
                });
                console.table(usereid);
                res.json({
                    "statusCode": "200",
                    "statusResponse": "ok",
                    "messege": reqId + " found",
                    "data": usereid
                })
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
})



/* workingg */
router.get("/users/:id/payout/", (req, res, next) => {
    let userId = req.params.id;

    userCollection.doc(userId).collection('payout').get()
        .then(snapshot => {
            const values = snapshot.docs.map(flattenDoc);
            console.table(values);
            res.json({
                "statusCode": "200",
                "statusResponse": "ok",
                "messege": userId + " found",
                "data": values
            })
        })

        function flattenDoc(doc) {
            return{id: doc.id, ...doc.data()} 
        } 
})



router.get("/recentpayout/:am/:pm", (req, res, next) => {

    let allUsers = [];
    let allUserData = [];

    userCollection.get()
        .then(snapshot => {


            snapshot.forEach(doc => {

                    allUsers.push(doc.id);

                    allUserData = snapshot.docs.map(flattenDoc2);
            });
            function flattenDoc2(doc) {

                return { id: doc.id, ...doc.data() }

            }
          

            let allPayout = [];
            
            for(i=0; i<allUsers.length; i++)
            {

                let userId= allUsers[i]

                userCollection.doc(userId).collection('payout').get()
                    .then(snapshot2 => {

                        if (!snapshot2.empty && userId != "4ADAN8FZ8EethW6ZBg9jrPNcNtj2" && userId != "0Es8vSiOSDX8PPDfoOEIH6Y2H343" && userId != "iy57glvFOLbUMlAEkViZdqgvwno1" && userId != "3Az2KJbXyHR48166mdTj5vRnUVX2" && userId !="A1NWsMhJLfa5pS8ApHd5BI5HfCd2"){

                            let values = snapshot2.docs.map(flattenDoc);
                            // values[k].payoutRequestDate.toLocaleDateString() == "10/7/2018"
                            // values[k].payoutRequestDate.toLocaleDateString().substring(0, 3) == "10/"
                            // console.log(str.substring(0, 3));
                            // values[k].payoutMedium == "Google Pay-Tez"
                            for(k=0;k<values.length;k++){
                                   
                                if (values[k].payoutStatus==false) {

                                    // console.log(userId)
                           
                                    for (j = 0; j < i; j++) {
                                        if (allUserData[j].id == userId) {
                                            console.log(allUserData[j].email)
                                        }
                                    }

                                    // console.log(typeof (values))
                                    allPayout = values;
                                    // console.log(allPayout[k])
                                    // console.log(allPayout[k].payoutRequestDate.toLocaleDateString())
                                    // console.log(allPayout.length)

                              
                                }

                            }

                        }

                    })

                function flattenDoc(doc) {

                    return { id: doc.id, ...doc.data() }

                }

                if(i==userId.length-1){

                    res.json({
                        "statusCode": "200",
                        "statusResponse": "ok",
                        "messege": " found",
                        "data": allPayout
                    })

                }

            };

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });



    // userCollection.doc(userId).collection('payout').get()
    //     .then(snapshot => {
    //         const values = snapshot.docs.map(flattenDoc);
    //         console.table(values);
    //         res.json({
    //             "statusCode": "200",
    //             "statusResponse": "ok",
    //             "messege": userId + " found",
    //             "data": values
    //         })
    //     })

    // function flattenDoc(doc) {
    //     return { id: doc.id, ...doc.data() }
    // }
})



router.get("/recentconv/", (req, res, next) => {
    // let userId = req.params.id;


    let allUsers = [];
    userCollection.get()
        .then(snapshot => {

            snapshot.forEach(doc => {
                // if(doc.exists){
                allUsers.push(doc.id);
                // console.log(doc.id)
                // }
            });


            let allPayout = [];

            for (i = 0; i < allUsers.length; i++) {

                let userId = allUsers[i]





                userCollection.doc(userId).collection('conversion').get()
                    .then(snapshot => {
                        if (!snapshot.empty) {
                            let values = snapshot.docs.map(flattenDoc);
                            console.log(userId)
                            console.log(typeof (values));
                            allPayout = values;
                            console.log(allPayout)
                            // allPayout.push({
                            //     "docID": userId,
                            //     "userDate": values
                            // })
                        }

                    })

                function flattenDoc(doc) {
                    return { id: doc.id, ...doc.data() }
                }
                if (i == userId.length - 1) {
                    res.json({
                        "statusCode": "200",
                        "statusResponse": "ok",
                        "messege": " found",
                        "data": allPayout
                    })
                }


            };


        })
        .catch(err => {
            console.log('Error getting documents', err);
        });



    // userCollection.doc(userId).collection('payout').get()
    //     .then(snapshot => {
    //         const values = snapshot.docs.map(flattenDoc);
    //         console.table(values);
    //         res.json({
    //             "statusCode": "200",
    //             "statusResponse": "ok",
    //             "messege": userId + " found",
    //             "data": values
    //         })
    //     })

    // function flattenDoc(doc) {
    //     return { id: doc.id, ...doc.data() }
    // }
})



router.post("/payment/:pid/:eid", (req, res, next) => {

    var dt = new Date();
    var utcDate = dt.toLocaleString();

    let allUsers = [];

    let pid=userCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
            allUsers.push(doc.id);
        });
                
        for (i = 0; i < allUsers.length; i++) {

            let userId = allUsers[i]

            let pid2 = userCollection.doc(userId).collection('payout').doc(req.params.pid).get().then(snapshot2 => {
                if(snapshot2.exists) {

                    userCollection.doc(userId).get().then(snapshot3 => {

                        if (snapshot3.exists && req.params.eid==snapshot3.data()["email"]) {

                      
                            console.log(snapshot2.data('payoutMedium'))
                                
                            let newUser = {
                                "paymentDate": utcDate,
                                "userId": userId,
                                "amountToBeCredited": snapshot2.data()["amountToBeCredited"],
                                "payoutMedium": snapshot2.data()["payoutMedium"],
                                "payoutNo": snapshot2.data()["payoutNo"],
                                "payoutRequestDate": snapshot2.data()["payoutRequestDate"],
                                "email": snapshot3.data()["email"],
                                "payoutId":req.params.pid
                            }
                                                    
                            
                            let allPayment = [];
                            paymentCollection.get().then(snapshot4 => {

                                snapshot4.forEach(doc => {
                                    allPayment.push(doc.id);
                                });

                                let count = 0;

                                for (j = 0; j < allPayment.length; j++) {

                                    let paymentId = allPayment[j]
                                    
                                    paymentCollection.doc(paymentId).get().then(snapshot5 => {

                                        if (snapshot5.data()["payoutId"] == req.params.pid  ) {
                                           
                                            res.json({
                                                "message": "payment creation failed: payout-id already exist"
                                            })

                                        } 
                                        
                                        else if(count==allPayment.length-1){

                                            let setNewUser = paymentCollection.doc().set(newUser);

                                            res.json({
                                                "message": req.params.pid + " of " + userId + " was successfully created"
                                            })

                                        } 
                                        
                                        else{
                                            count++;
                                        }

                                    })

                                }

                            });

                        }
                        else{
                            res.json({
                                "message": "User creation failed"
                            })

                        }

                    })

                }
                            
            })
                        
        };

    })
 
});



router.post("/payment/:pid/:eid/true", (req, res, next) => {

    let allUsers = [];

    let pid = userCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
            allUsers.push(doc.id);
        });

        for (i = 0; i < allUsers.length; i++){
            
            let userId = allUsers[i]
         
            userCollection.doc(userId).get().then(snapshot2 => {

                if (req.params.eid == snapshot2.data()["email"]){

                    userCollection.doc(userId).collection('payout').doc(req.params.pid).get().then(snapshot3 => {

                        if (snapshot3.exists){

                            userCollection.doc(userId).collection('payout').doc(req.params.pid).update({
                                "payoutStatus":true
                            })

                            res.json({
                                "message": req.params.pid + " of " + userId + " updated successfully to true" 
                            })

                        }
                        else{
                            res.json({
                                "message": "change status to true failed, pid not found"
                        
                            })
                            
                        }

                    });

                }
                
            });

        }

    })

});



module.exports = router;

/* query which console.log user/id
let query = userCollection.where('email', '==', reqId);
var app = [];
query.limit(1).get().then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
        app.push(documentSnapshot.ref.path)
    });
});
console.log(app[0]);
*/


/* query which console.log all data that same id
var query2 = userCollection.where('email', '==', reqId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
*/


/* query users/uid/payout
userCollection.doc(userId).collection('payout').get()
    .then(snapshot => {
        const values = snapshot.docs.map(flattenDoc);
        console.table(values);
    })

function flattenDoc(doc) {
    return { id: doc.id, ...doc.data() }
*/



/* workingg */
// router.delete("/users/:id", (req, res, next) => {
//     let deleteDoc = userCollection.doc(req.params.id).delete();
//     res.json({
//         "messege": "User was deleted successfully",
//     })
// })





/* workingg */
// router.post("/users", (req, res, next) => {
//     if (req.body.name != null && req.body.email != null || req.body.name != undefined && req.body.email != undefined) {

//         let docId = Math.floor(Math.random()) * (99999 - 00000);

//         let newUser = {
//             "name": req.body.name,
//             "email": req.body.email
//         }
//         let setNewUser = userCollection.doc(String(docId)).set(newUser);

//         res.json({
//             "message": "User was successfully created,"
//         })
//     } else {
//         res.json({
//             "message": "req.body params are undefined"
//         })

//     }
// });




/*
router.put("/users/:id", (req, res, next) => {
    let userId = req.params.id;

    let transaction = db.runTransaction(transaction => {
        return transaction.get(userCollection).then( doc =>{
            if (req.body.name != undefined && req.body.email != undefined) {

             transaction.update(userCollection.doc(userId), {
                name: req.body.name,
                email: req.body.email
            })
            }else {
                res.json({
                    "statusCode": "500",
                    "statusResponse": "Erron parsing the data",
                    "messege": "There is no data to parse"
                })
            }
        });

    })
    .then(result => {
        res.json({
                "statusCode": "200",
                "statusResponse": "ok",
                "messege": "Transaction Success"
        });
    })
    .catch(err =>{
        console.log(err);
    });
});
*/