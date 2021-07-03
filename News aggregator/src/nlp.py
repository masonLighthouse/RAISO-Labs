import random
# import nltk
from textblob import TextBlob, Word

news_summary = """A woman died from treatment delays after a hospital in Germany hit by a cyberattack was forced to turn away emergency patients.
This is a small sample of the toll from ransomware attacks, in which hackers break into computer networks and freeze the digital information until the targeted organization or city pays for its release.
Victims have two bad choices: Give in to extortion and hope the criminals didn’t do too much damage, or refuse and risk the hackers releasing or deleting essential information.
I spoke to Charles Carmakal, an executive with the cybersecurity response company FireEye Mandiant, about the root causes and fixes for ransomware attacks.
What are the root causes of ransomware?"""


def nlp_classification(text: str) -> list[str]:
    """
    Performs different nlp functions on article texts/summaries, inc. 
    POS tagging, getting the individual words, and lemmatization.

    This can potentially return more things

    Arguments:
        text (str): URL for an article
    Returns:
        list[str]: A list of lemmas (what the article is most likely about given the summary)
    """
    summary = TextBlob(text)

    # part of speech tagging
    # print(f'POS Tagging:  {str(summary.tags)} \n')

    # tokenization into words
    # print(f'Words: {str(summary.words)}')

    # word inflection
    # print(f'Plural of {summary.words[1]}: {summary.words[1].pluralize()}')
    # print(f'Singular of {summary.words[5]}: {summary.words[5].singularize()}')

    # tokenization into sentences
    # print(f'Sentences: {str(summary.sentences)} \n')

    # noun entity recognition (get all of the nouns)
    nouns = []
    for word, tag in summary.tags:
        if tag == "NN":
            nouns.append(word.lemmatize())
    # print("this article is about: \n")
    lemma_list = []
    for item in random.sample(nouns, 5):
        word = Word(item)
        # Lemmatization
        word.lemmatize()
        lemma_list.append(word.pluralize())
        # print(word.pluralize())
    return lemma_list


# nltk.download() -> download the average perceptron tagger and also run python -m textblob.download_corpora
nlp_classification(news_summary)
