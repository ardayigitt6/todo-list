const baseUrl = "http://192.168.68.65:5000"
const apiFetch = function (path, options = {}) {

    const url = baseUrl + path;
    const token = localStorage.getItem("token");

    options.headers = {

        ...options.headers,
        Authorization: token ? "Bearer " + token : "", "Content-Type": "application/json"

    };

    return fetch(url, options)
        .then((res) => {
            if (res.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            return res.json();
        });
}

module.exports = {
    apiFetch,
}