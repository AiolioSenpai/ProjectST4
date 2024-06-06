import { StemmerEn, StopwordsEn } from '@nlpjs/lang-en';

function constructCollection(description_list) {
  const stemmer = new StemmerEn();
  const collection = new Set();
  stemmer.stopwords = new StopwordsEn();
  for (const description of description_list) {
    const wordList = stemmer.tokenizeAndStem(description, false);
    for (const word of wordList) {
      collection.add(word);
    }
  }

  return collection;
}
export default constructCollection;
