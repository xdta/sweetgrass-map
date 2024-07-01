import requests
from bs4 import BeautifulSoup
import os
import re

# Function to download an image from a URL
def download_image(image_url, save_path):
    response = requests.get(image_url)
    if response.status_code == 200:
        with open(save_path, 'wb') as file:
            file.write(response.content)

# Function to create a valid filename
def create_valid_filename(filename):
    return re.sub(r'[\\/*?:"<>|]', "", filename)

# URL of the page with the links
page_url = 'https://lcdl.library.cofc.edu/lcdl/?per_page=100&q=sweetgrass&search_field=all_fields'

# Send a GET request to the page
response = requests.get(page_url)
soup = BeautifulSoup(response.content, 'html.parser')

# Directory to save images
save_directory = 'sweetgrass_images'
os.makedirs(save_directory, exist_ok=True)

# Find all article elements
articles = soup.find_all('article', class_='document')

for article in articles:
    img_tag = article.find('img')
    if img_tag and 'src' in img_tag.attrs:
        image_url = img_tag['src']
        # Modify the URL to get the full image
        full_image_url = image_url.replace('/200,', '/800,')

        # Find the detailed page URL
        detailed_page_link = article.find('a', href=True)
        if detailed_page_link:
            detailed_page_url = 'https://lcdl.library.cofc.edu' + detailed_page_link['href']

            # Send a GET request to the detailed page
            detail_response = requests.get(detailed_page_url)
            detail_soup = BeautifulSoup(detail_response.content, 'html.parser')

            # Extract title, date, and creator
            title = detail_soup.find('dt', text='Title:').find_next('dd').text.strip() if detail_soup.find('dt', text='Title:') else 'Unknown_Title'
            date = detail_soup.find('dt', text='Date:').find_next('dd').text.strip() if detail_soup.find('dt', text='Date:') else 'Unknown_Date'
            creator = detail_soup.find('dt', text='Creator (Personal):').find_next('dd').text.strip() if detail_soup.find('dt', text='Creator (Personal):') else 'Unknown_Creator'

            # Create a valid filename
            filename = f"{title}_{date}_{creator}.jpg"
            filename = create_valid_filename(filename)
            save_path = os.path.join(save_directory, filename)

            # Construct the full URL if necessary
            if not full_image_url.startswith('http'):
                full_image_url = 'https://iiif.library.cofc.edu' + full_image_url

            # Download the image
            download_image(full_image_url, save_path)
            print(f'Downloaded {filename}')

print('All images have been downloaded.')
