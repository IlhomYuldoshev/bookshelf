const endpoints = {
    account: {
        me: '/myself',
    },
    auth: {
        sign_up: '/signup',
    },
    books: {
        getAll: '/books',
        search: (title: string) => `/books/${title}`,
        create: '/books',
        edit: (id: string) => `/books/${id}`,
        delete: (id: string) => `/books/${id}`,
    },
};

export { endpoints };

// console.log(pm.request.url.getPath())
// if (pm.request.url.getPath()=="/signup"){
//     body = JSON.parse(pm.request.body)
//     pm.collectionVariables.set("key", body.key);
//     pm.collectionVariables.set("secret", body.secret);
//     console.log("updated key and secret: "+body.key+' '+body.secret)
// }else{
//     signstr = pm.request.method+
//     pm.request.url.getPathWithQuery()+
//     pm.request.body+
//     pm.collectionVariables.get("secret")
//     sign = signature = CryptoJS.MD5(signstr).toString();
//     console.log("signstr: "+signstr)
//     console.log("sign: "+sign)
//     pm.collectionVariables.set("sign",sign)
// }
