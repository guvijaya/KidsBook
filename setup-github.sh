#!/bin/bash

# GitHub Configuration Script for Kids Essays Website
# This script helps you quickly configure your GitHub repository settings

echo "🐙 GitHub Configuration Setup for Kids Essays Website"
echo "=================================================="

# Check if github-content.js exists
if [ ! -f "js/github-content.js" ]; then
    echo "❌ Error: github-content.js not found!"
    echo "Make sure you're running this script from the website root directory."
    exit 1
fi

echo ""
echo "📝 Please provide your GitHub repository details:"
echo ""

# Get GitHub username
read -p "GitHub Username: " github_username
if [ -z "$github_username" ]; then
    echo "❌ GitHub username is required!"
    exit 1
fi

# Get repository name
read -p "Repository Name (default: kids-essays): " repo_name
if [ -z "$repo_name" ]; then
    repo_name="kids-essays"
fi

# Get branch name
read -p "Branch Name (default: main): " branch_name
if [ -z "$branch_name" ]; then
    branch_name="main"
fi

# Get content path
read -p "Content Path (default: essays): " content_path
if [ -z "$content_path" ]; then
    content_path="essays"
fi

echo ""
echo "🔧 Configuring github-content.js..."

# Create backup
cp js/github-content.js js/github-content.js.backup
echo "📋 Backup created: js/github-content.js.backup"

# Update the configuration
sed -i "s/this.githubUsername = 'your-github-username';/this.githubUsername = '$github_username';/" js/github-content.js
sed -i "s/this.repositoryName = 'kids-essays';/this.repositoryName = '$repo_name';/" js/github-content.js
sed -i "s/this.branch = 'main';/this.branch = '$branch_name';/" js/github-content.js
sed -i "s/this.contentPath = 'essays';/this.contentPath = '$content_path';/" js/github-content.js

echo "✅ Configuration updated!"
echo ""
echo "📋 Your settings:"
echo "   GitHub Username: $github_username"
echo "   Repository Name: $repo_name"
echo "   Branch: $branch_name"
echo "   Content Path: $content_path"
echo ""
echo "🌐 Your repository URL: https://github.com/$github_username/$repo_name"
echo "📁 Expected content structure: https://github.com/$github_username/$repo_name/tree/$branch_name/$content_path"
echo ""
echo "📝 Next steps:"
echo "   1. Create your GitHub repository if you haven't already"
echo "   2. Add your essay markdown files to the $content_path folder"
echo "   3. Test your website to see the content loading from GitHub"
echo ""
echo "🎉 Setup complete! Happy writing! 📚✨"