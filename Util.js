import { AsyncStorage } from 'react-native';


export function retrieveAuthData() {
	return AsyncStorage.multiGet(['authId', 'token']).then(function(res) {
		if(res[0][1] === null || res[1][1] === null)
			throw new Error();
		else
			return [res[0][1], res[1][1]];
	}).catch(function() {
		throw new Error();
	});
}

export function deleteAuthData() {
	return AsyncStorage.multiRemove(['authId', 'token']).then(function(res) {
		return null;
	}).catch(function() {
		throw new Error();
	});
}

 