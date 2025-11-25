# Nimbus Blog Editor

Welcome to the Nimbus Blog Editor. This tool is designed to streamline the process of moving finished content from Notion onto the live site staging environment.

Use this editor once a new article is completed in Notion and has been moved to the "SEO Blog Content Calendar."

## How to Use

### 1. Understanding the Interface Views

The editor has two main views, controlled by a toggle switch located in the **bottom right corner** of the screen.

- **Preview Mode (Staging):** This view allows you to see exactly how all information and articles will appear on the live site.
- **Edit Mode:** This is the working mode. Here you can edit existing articles, add new ones, and view all scheduled articles (even those that haven't been published yet).

> **Note:** The instructions below apply specifically to the **Edit** view.

### 2. Creating and Scheduling New Articles

To enter a new article found in the SEO Blog Content Calendar, use the **Create** function.

Please ensure the following fields are entered accurately:

1.  **Article Title:** The main headline.
2.  **Author:** The primary writer of the piece.
3.  **Reviewer:** (Optional) If the article was written by an intern, indicate the reviewer here.
4.  **Scheduled Publication Date:** The date the article should go live.
5.  **Brief Article Description:** A short summary for preview cards and SEO.
6.  **Article Body:** Copy and paste the content directly from Notion. It will automatically convert into markdown format.
7.  **Categories:** **(Important)** Select all relevant categories the article falls into.
8.  **Header Image URL:** Paste the link to the main header image.
    - _Alt Text Note:_ Image Alt Text will automatically update when an image link is added, but it can be manually edited if necessary.

Once all information is entered, click the **"Save Changes"** button in the bottom right corner.

> **Note:** If an article is scheduled for a future date, it will be visible in Edit view but will _not_ appear in Preview view until that date passes.

### 3. Managing Featured Content

To change the currently featured article on the site's main page, select **"Cycle Featured"** from the edit menu.

---

### 🔥 CRITICAL: Saving Changes to the Codebase

Once you have made all desired edits, created new articles, or cycled featured content, you must manually update the project source file to make the changes permanent.

**Follow these steps carefully:**

1.  Select **"Project Source"** from the edit menu. Two sets of code will appear.
2.  Ensure you have selected the tab labeled **"Content Data (data/articles.ts)"**.
3.  Click the button to **copy** this code to your clipboard.
4.  In your code editor, navigate to the file path: `data/articles.ts`.
5.  Select all contents of that file and **replace** the entire contents by pasting the code you just copied.
6.  Save the file in your code editor and **reload the app**. All changes should now be visible.

---

### Data Backup and Restoration

You can create local backups of the current app data JSON.

- **To Backup:** Select **"Backup"** from the edit menu to download a current JSON file.
- **To Restore:** Select **"Restore"** from the edit menu and upload a previously saved JSON backup file.
