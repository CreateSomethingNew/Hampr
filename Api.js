import { retrieveAuthData } from './Util.js'

export default function GetData() {
  console.log("Loading...")

  return retrieveAuthData()
    .then(cookies => {
        console.log("fetching user global data", "cookies", cookies)
        return fetch('http://' + global.serverUrl + ':8080/api/user/find', {
            method: 'GET',
            headers: {
                "authId": cookies[0],
                "token": cookies[1]
            }
        })
        .then(response => {
            if (!response.ok) {
                console.log("global fetch returned bad response:")
                console.log(response)
                throw new Error();
            }
            return response.json();
        })
        .then(json => {
            global.outfits = json.outfits;
            global.garments = json.garments;
            global.score = json.score;
            global.trending = "dogs"
            console.log("Done loading global data.")

        })
        .catch(error => console.log("error getting global data", error));
    });
}
