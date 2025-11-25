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

---

### Summary for Web Team

Please implement the design found in **`App.tsx`**, **`index.html`** (styles), and the components in the **`components/`** folder (excluding `EditModal` and `ExportModal`). The site should function as if `isEditMode` is permanently set to `false`.

To update the live site to match the **Preview Mode**, pass the files listed in **Section 1** to the web development team. They should ignore or strip out the files in **Section 2**.

### 1. Core Structure & Appearance Files (The "Preview" Mode)

These files create the look and feel of the reader-facing blog.

- **`index.html`**

  - **Role:** Defines the global CSS styles, including the specific typography, colors (`#010202` background), and the custom layouts for ads (`.article-ad-card`).
  - **Note for Devs:** Pay attention to the `<style>` block in the `<head>`, which contains the Tailwind resets and custom classes for the article content rendering.

- **`App.tsx`**

  - **Role:** The main layout controller. It composes the Header, SubHeader, and the main content grid.
  - **Note for Devs:** This file currently contains the "Edit Mode" toggle logic. They should look at the `renderContent()` function to see how the "Preview" mode is structured and ignore the `EditModeToggle` component.

- **`components/ArticleDetailView.tsx`**

  - **Role:** This is the most critical file for the actual blog posts. It handles:
    - Parsing Markdown into HTML.
    - Generating the Table of Contents dynamically.
    - Injecting the "Nimbus" and "WeightWise" ads into the article text.
  - **Note for Devs:** Contains an "Edit" button that should be hidden in the live version.

- **`components/Header.tsx` & `components/SubHeader.tsx`**

  - **Role:** The top navigation bars. The `SubHeader` contains the specific logic for the sticky scrolling category menu.

- **`components/ArticleCard.tsx` & `components/CategoryCard.tsx`**

  - **Role:** The components that render the grid of articles and categories on the home page.
  - **Note for Devs:** `ArticleCard.tsx` has logic to show "Draft" or "Scheduled" badges; the live site should only render published articles.

- **`components/Footer.tsx`**

  - **Role:** The site-wide footer with social icons and links.

- **`components/TableOfContents.tsx`**
  - **Role:** The sidebar navigation that appears inside articles.

### 2. Files to Exclude (The "Edit" Mode)

Your web team does **not** need these files to build the public-facing site. These are only for the internal tool you use to write posts.

- **`components/EditModal.tsx`**: The popup form used to write/edit articles.
- **`components/ExportModal.tsx`**: The tool used to copy/paste code.
- **`hooks/useBlogData.ts`**: Handles the local storage saving logic (unless you want a dynamic site that reads from a database, this is likely irrelevant for a static "Preview" build).
