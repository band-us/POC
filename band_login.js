const crypto = require('crypto');
const axios = require("axios");
const querystring = require("querystring");

const base64_decode = str => Buffer.from(str, "base64");

function decrypt(text, password) {
	let decipher = crypto.createDecipheriv('aes-128-cbc', password, password);
	return decipher.update(text, 'base64').toString("base64");
}

const parseSetCookie = cookies => {
	let ret = {};
	cookies.map(str => str.split(";").shift()).filter(str => str.split("=").pop() !== '""').forEach(v => {
		if (ret[v.split("=")[0]] === undefined || v.split("=")[1] !== '""') ret[v.split("=")[0]] = v.split("=")[1];
	});
	return ret;
}
const mergeCookie = (origin, after) => {
	for (let k of Object.keys(after)) {
		origin[k] = after[k];
	}
	return origin;
}
const encodeCookie = cookie => Object.keys(cookie).map(k => `${k}=${cookie[k]}`).join("; ");

let headers = {
	"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
	"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
	"accept-encoding": "gzip, deflate, br",
	"accept-language": "ko,en-US;q=0.9,en;q=0.8"
};

(async () => {
	let response = await axios.get("https://auth.band.us/login_page", {
		headers: headers
	});

	let cookie = parseSetCookie(response.headers["set-cookie"]);
	headers["cookie"] = encodeCookie(cookie);
	response = await axios.get("https://auth.band.us/email_login?keep_login=true", {
		headers: headers
	});
	cookie = mergeCookie(cookie, parseSetCookie(response.headers["set-cookie"]));
	headers["cookie"] = encodeCookie(cookie);


	console.log(`Set Cookie (${headers["cookie"]})`);

	//get rkey
	let rkey_pos = response.data.indexOf("rkey");
	let rkey_value_pos = response.data.indexOf("value=\"", rkey_pos);
	let rkey_end_pos = response.data.indexOf("\">", rkey_value_pos + 1);

	let rkey = response.data.substr(rkey_value_pos + "value=\"".length, rkey_end_pos - rkey_value_pos - "value=\"".length);

	response = (await axios.get("https://auth.band.us/get_time_correction", {
		headers: headers
	})).data;

	let key_pos = response.indexOf(`bandAuth.request.key = bauth.sjcl.codec.base64.toBits('`) + `bandAuth.request.key = bauth.sjcl.codec.base64.toBits('`.length;
	let key = response.substr(key_pos, response.indexOf("'", key_pos + 1) - key_pos); //key == iv

	let cipher_pos = response.indexOf(`bandAuth.request.ciphertext = bauth.sjcl.codec.base64.toBits('`) + `bandAuth.request.ciphertext = bauth.sjcl.codec.base64.toBits('`.length;
	let cipher = response.substr(cipher_pos, response.indexOf("'", cipher_pos + 1) - cipher_pos);

	const hmac_secret = decrypt(cipher, base64_decode(key)); //cipher
	console.log(`Hmac Secret: ${hmac_secret}`);

	let login_data = [
		{
			name: "email",
			value: ""
		}, {
			name: "rkey",
			value: rkey
		}, {
			name: "akey",
			value: "abcf2g68v100v172dkdk6v9edkfk9wl1"
		}, {
			name: "timestamp",
			value: Date.now()
		}
	];

	const signature = crypto.createHmac("sha256", base64_decode(hmac_secret)).update(`/email_login?${login_data.filter(obj => obj.name !== "signature").map(obj => obj.name + "=" + obj.value).join("&")}`).digest("base64");
	console.log(`Cipher: ${cipher}, Key: ${key}, Signature: ${signature}`);

	let formdata = {};
	login_data.forEach(obj => formdata[obj.name] = obj.value);
	formdata.signature = signature;

	await axios.post("https://auth.band.us/email_login", querystring.encode(formdata), {
		headers: headers,
		maxRedirects: 0
	}).catch(e => response = e.response);

	if (response.status === 302) {
		console.log(`Login Email Response: ${response.status} ${response.statusText} (Location: ${response.headers.location})`);
		cookie = mergeCookie(cookie, parseSetCookie(response.headers["set-cookie"]));
		console.log(`Set Cookie (${encodeCookie(cookie)})`);

		headers["cookie"] = encodeCookie(cookie);
		response = (await axios.get("https://auth.band.us/continue_email_login", {
			headers: headers
		})).data;

		console.log(response);

		//어차피 비밀번호는 리캡챠가 필요하기 때문에 더 이상의 분석은 무의미..
	}

	//console.log(response, formdata)
})();
