const myPromise = Promise.resolve(Promise.resolve("Promise!"));

function funcOne() {
	myPromise.then(res => res).then(res => console.log(res));
	setTimeout(() => console.log("Timeout!", 0));
	console.log("Last line!");
}

async function funcTwo() {
	const res = await myPromise;
	console.log(await res);
	setTimeout(() => console.log("Timeout!", 0));
	console.log("Last line!");
}

funcOne();
funcTwo();