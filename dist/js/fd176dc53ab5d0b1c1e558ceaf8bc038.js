const config = {
	languages: [],
	set language(lang) {
		return this.languages.push(lang);
	}
};
console.log(config.language);