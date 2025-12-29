import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Article from "../models/Article.js";

dotenv.config();

const BASE_URL = "https://beyondchats.com";
const START_PAGE = 15;
const REQUIRED_ARTICLES = 5;

async function scrapeOldestArticles() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const collectedArticleUrls = [];
    let currentPage = START_PAGE;

    // 2. Collect article URLs starting from LAST PAGE and OLDEST ARTICLES FIRST
    while (collectedArticleUrls.length < REQUIRED_ARTICLES && currentPage > 0) {
      const pageUrl = `${BASE_URL}/blogs/page/${currentPage}/`;
      console.log(`Fetching page ${currentPage}: ${pageUrl}`);

      try {
        const pageResponse = await axios.get(pageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const $ = cheerio.load(pageResponse.data);

        const articleLinks = [];
        
        $("article h2 a").each((_, el) => {
          const url = $(el).attr("href");
          if (url && url.includes('/blogs/')) {
            const fullUrl = url.startsWith("http")
              ? url
              : BASE_URL + (url.startsWith("/") ? url : "/" + url);
            
            if (!articleLinks.includes(fullUrl)) {
              articleLinks.push({
                url: fullUrl,
                title: $(el).text().trim()
              });
            }
          }
        });

        console.log(`Found ${articleLinks.length} articles on this page`);
        
        if (articleLinks.length > 0) {
          const reversedLinks = articleLinks.reverse();
          for (const article of reversedLinks) {
            if (collectedArticleUrls.length >= REQUIRED_ARTICLES) break;
            
            if (!collectedArticleUrls.includes(article.url)) {
              collectedArticleUrls.push(article.url);
              console.log(`Added (OLDEST on page): ${article.title.substring(0, 40)}...`);
            }
          }
        }

      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error.message);
      }

      // Move to previous page (page 14, then 13, etc.)
      currentPage--;
      
      // Add a small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log(`\n Collected ${collectedArticleUrls.length} OLDEST article URLs`);
    console.log("\n Starting to scrape article content...\n");
    
    for (let i = 0; i < collectedArticleUrls.length; i++) {
      const articleUrl = collectedArticleUrls[i];
      console.log(`[${i + 1}/${collectedArticleUrls.length}] Scraping: ${articleUrl}`);

      try {
        const alreadyExists = await Article.findOne({ sourceUrl: articleUrl });
        if (alreadyExists) {
          console.log("Article already exists in database, skipping.");
          continue;
        }

        const articleResponse = await axios.get(articleUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const $ = cheerio.load(articleResponse.data);

        const title = $("h1").first().text().trim();

        const content = $(".post-content").text().trim();
        
        let author = "BeyondChats";
        
        const authorSpan = $(".elementor-icon-list-text.elementor-post-info__item.elementor-post-info__item--type-author");
        if (authorSpan.length > 0) {
          author = authorSpan.first().text().trim();
          console.log(`Author (from elementor span): ${author}`);
        } 
        else {
          $("*").each((_, el) => {
            const className = $(el).attr("class") || "";
            if (className.includes("author") && !className.includes("comment-form")) {
              const text = $(el).text().trim();
              if (text && text.length > 2 && text.length < 50 && !text.includes("*")) {
                author = text;
                console.log(`Author (from class containing "author"): ${author}`);
                return false;
              }
            }
          });
        }
        if (author === "BeyondChats") {
          const postInfo = $(".elementor-post-info");
          if (postInfo.length > 0) {
            postInfo.find("span").each((_, span) => {
              const text = $(span).text().trim();
              if (text && text.length > 2 && text.length < 50 && 
                  !text.includes("202") && !text.includes("Comment")) {
                author = text;
                console.log(`Author (from post-info span): ${author}`);
                return false;
              }
            });
          }
        }
        let publishedDate = $("time[datetime]").attr("datetime");
        if (!publishedDate) {
          const timeElement = $("time").first();
          if (timeElement.length > 0) {
            publishedDate = timeElement.text().trim();
          }
        }
        if (!title || !content || content.length < 100) {
          console.log(`Skipping - insufficient content`);
          continue;
        }

        console.log(`Title: ${title.substring(0, 60)}...`);
        console.log(`Author: ${author}`);
        console.log(`Content: ${content.length} characters`);
        console.log(`Date: ${publishedDate || 'Not found'}`);

        // 4. Save to database
        await Article.create({
          title,
          content,
          author,
          publishedDate,
          sourceUrl: articleUrl,
          isUpdated: false,
        });

        console.log(`Saved: "${title.substring(0, 50)}..."\n`);

        // Delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error scraping article:`, error.message);
      }
    }

    console.log("\n Scraping completed successfully!");
    
    const totalArticles = await Article.countDocuments();
    console.log(`Total articles in database: ${totalArticles}`);

  } catch (error) {
    console.error("Scraping failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

scrapeOldestArticles();