from news_extract import *
from news_scrape import *
from news_nlp import *
from nlp import *
import time

if __name__ == "__main__":
    print("Getting articles...")
    time.sleep(2)
    print("Retreiving summaries...") 
    time.sleep(2)
    content_string = get_content_string(
        "https://www.nytimes.com/section/technology")
    start_indices, end_indices = find_occurrence(get_content_string(
        "https://www.nytimes.com/section/technology"))
    url_list = get_all_urls(start_indices, end_indices, content_string)
    # pull the metedata from the article
    for url in url_list:
        article_summary, articel_author, article_date, article_images = summarize_article(
            url)
        polarity, subjectivity = find_sentiment(article_summary)
        lemma_list = ["None"]
        if article_summary != "None":
            lemma_list = nlp_classification(article_summary)
        print(f'Summary: {article_summary}')
        print(f'Polarity: {polarity} \n Subjectivity: {subjectivity}')
        print(f'This article is about: ')
        for noun in lemma_list:
            print(f'{noun}')
        print("--------------------------------------")
    print(f'\n The {str(len(url_list))} article(s) have been extracted')
