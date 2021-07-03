from newspaper import Article
# import nltk (download punkt to run this)


def summarize_article(url: str) -> str:
    """
    Summarizes an article using the newspaper 3k Article class.

    Arguments:
        url (str): URL for an article
    Returns:

    """
    # init the class with the url
    article = Article(url)
    try:
        article.download()
        article.parse()
        article.download('punkt')
        article.nlp()
    except:
        pass
        print("passing...")
        # shitty but working on
        return "None", "None", "None", "None"
    date = article.publish_date
    image_string = "All images: "
    for image in article.images:
        image_string += "\n\t" + image
    # alternative is to use article.text
    return article.summary, str(article.authors[0]), str(date.strftime("%m/%d/%Y")), image_string
