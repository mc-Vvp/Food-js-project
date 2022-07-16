const postData = async (url, data) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: data
    });

    return await res.json();
};

const getResources = async (url) => {
    const res = await fetch(url);
    if(!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`); //trow error if request is mot ok (because fetch only vount error if no connection)
    }
    return await res.json();
};

export {postData};
export {getResources};