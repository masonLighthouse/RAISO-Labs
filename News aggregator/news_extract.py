import requests
from bs4 import BeautifulSoup as soup
from requests.models import Response


def get_content_string(url: str) -> list[str]:
    """
    Returns HTML content strings containing all article hyperlinks.

    Arguments:
        url (str): URL for an article
    Returns:
        content_string (list[str]): String of all of the article URLs on the page
    """
    page: Response = requests.get(url)
    page_soup: soup = soup(page.content, 'html.parser')
    # extract all of the script tags with a type of app/ld+json
    containers: list = page_soup.find_all(
        "script", {"type": "application/ld+json"})
    # extract all of the tags
    article_list: list = []
    for container in containers:
        for dict in container:
            article_list.append(dict)
    article_list[0:2] = ["".join(article_list[0:2])]
    content_string = article_list[0]
    # extract the starting index
    article_index = content_string.index("itemListElement")
    content_string = content_string[article_index + 18:]
    return content_string


def find_occurrence(content_string: list[str]) -> tuple[list[str], list[str]]:
    """
    Returns the starting and ending indices of every article hyperlink

    Arguments:
        content_string (list[str]): List of all of the article URLs
    Returns
        start_indices (list[str]): a list of all of the starting indices that the URLs are found at
        end_indices (list[str]): a list of all of the ending indices that the URLs are found at
    """
    start_indices = []
    end_indices = []
    for i in range(len(content_string)):
        # assumes all of the articles will be written in 2021
        if content_string.startswith("https://www.nytimes.com/2021", i):
            start_indices.append(i)
        # if it starts with .html - +5 removes the .html text
        if content_string.startswith(".html", i):
            end_indices.append(i + 5)
    return start_indices, end_indices


def get_all_urls(start_indices: list[int], end_indices: list[int], content_string: list[str]) -> list[str]:
    """
    Get all of the article URL's

    Arguments:
        start_indices (list[int]): a list of all of the article start indices
        end_indices (list[int]): a list of all of the article end indices (the index where they end)
        content_string (list[str]): a list of all of the article URLs
    Returns:
        url_list (list[str]): a list of all of the url's 
    """
    url_list = []
    for i in range(len(start_indices)):
        url_list.append(content_string[start_indices[i]:end_indices[i]])
    return url_list


if __name__ == "__main__":
    content_string = get_content_string(
        "https://www.nytimes.com/section/technology")
    start_indices, end_indices = find_occurrence(get_content_string(
        "https://www.nytimes.com/section/technology"))
    print(
        f'All tech news URLs from the new york times: {get_all_urls(start_indices, end_indices, content_string)}')
