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

# Base URL for constructing full URLs
base_url = 'https://digital.tcl.sc.edu'

# URL of the page with the links
page_url = 'https://digital.tcl.sc.edu/digital/collection/scrm/search/searchterm/Charleston%20County/field/title/mode/all/conn/and/order/date/ad/asc/cosuppress/1'

# Send a GET request to the page
response = requests.get(page_url)
soup = BeautifulSoup(response.content, 'html.parser')

# Directory to save images
save_directory = 'map_images'
os.makedirs(save_directory, exist_ok=True)

# Find all a elements with class 'SearchResult-container'
links = soup.select('a.SearchResult-container')

for link in links:
    href = link['href']
    detailed_page_url = base_url + href

    # Send a GET request to the detailed page
    detail_response = requests.get(detailed_page_url)
    detail_soup = BeautifulSoup(detail_response.content, 'html.parser')

    # Extract the full image URL
    img_tag = detail_soup.select_one('div.ItemImage-itemImage img')
    if img_tag and 'src' in img_tag.attrs:
        full_image_url = base_url + img_tag['src']

        # Extract metadata
        original_date = detail_soup.select_one('tr.field-date span').text.strip() if detail_soup.select_one('tr.field-date span') else 'Unknown_Original_Date'
        county_revised_date = detail_soup.select_one('tr.field-county span').text.strip() if detail_soup.select_one('tr.field-county span') else 'Unknown_County_Revised_Date'
        state_revised_date = detail_soup.select_one('tr.field-state span').text.strip() if detail_soup.select_one('tr.field-state span') else 'Unknown_State_Revised_Date'

        # Create a valid filename
        filename = f"{original_date}_county_{county_revised_date}_state_{state_revised_date}.jpg"
        filename = create_valid_filename(filename)
        save_path = os.path.join(save_directory, filename)

        # Download the image
        download_image(full_image_url, save_path)
        print(f'Downloaded {filename}')

print('All images have been downloaded.')
