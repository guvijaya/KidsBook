/**
 * GitHub Content Service for Kids Essays Website            en: {
                name: 'English',
                essays: [
                    { file: 'en/sample-with-images.md', title: 'Sample Story with Images', icon: '🖼️', description: 'Example of how to use images in stories' },
                    { file: 'en/mountain-sunrise.md', title: 'Mountain Sunrise Adventure', icon: '🌅', description: 'An amazing sunrise experience on Mt. Rainier' },
                    { file: 'en/train-journey.md', title: 'Train Journey', icon: '🚂', description: 'Exciting train adventures and discoveries' },
                    { file: 'en/river-trail.md', title: 'River Trail Cycling', icon: '🚴‍♂️', description: 'Cycling adventures on the Sammamish River Trail' },
                    { file: 'en/marymoor-park.md', title: 'Marymoor Park Fun', icon: '🎯', description: 'Family activities and fun at Marymoor Park' },
                    { file: 'en/school-language-credits.md', title: 'World Language Credits', icon: '📚', description: 'Learning about language education and tests' }
                ]
            },odule handles fetching markdown files from GitHub repository
 */

class GitHubContentService {
    constructor() {
        // Simple configuration for GitHub Pages - essays folder in same repository
        this.baseUrl = './essays';
        this.contentPath = 'essays';
        
        // Language-specific essay configurations
        this.essayConfigs = {
            ta: {
                name: 'தமிழ்',
                essays: [
                    { file: 'ta/bus.md', title: 'பள்ளிப் பேருந்து', icon: '�', description: 'பள்ளிப் பேருந்தில் பயணம் செய்யும் அனுபவம்' },
                    { file: 'ta/halloween.md', title: 'ஹாலோவின் பண்டிகை', icon: '🎃', description: 'ஹாலோவின் கொண்டாட்டத்தின் மகிழ்ச்சி' },
                    { file: 'ta/escape-room.md', title: 'தப்பிக்கும் அறை', icon: '🧩', description: 'புதிர் அறையில் குழுவாக விளையாடிய அனுபவம்' },
                    { file: 'ta/snow-day.md', title: 'பனி நாள்', icon: '❄️', description: 'பனி விழும் நாளின் சுவையான நினைவுகள்' },
                    { file: 'ta/boat.md', title: 'படகுச் சவாரி', icon: '🚤', description: 'பல்வேறு படகுகளில் சவாரி செய்த அனுபவங்கள்' },
                    { file: 'ta/farmers.md', title: 'உழவர்கள்', icon: '👨‍🌾', description: 'உழவர் சந்தையின் அழகிய காட்சிகள்' },
                    { file: 'ta/potluck.md', title: 'கூட்டாஞ்சோறு', icon: '�️', description: 'நண்பர்களுடன் சேர்ந்து உண்ணும் மகிழ்ச்சி' },
                    { file: 'ta/birthday.md', title: 'என் பிறந்தநாள்', icon: '�', description: 'பிறந்தநாள் கொண்டாட்டத்தின் நினைவுகள்' },
                    { file: 'ta/garden.md', title: 'தோட்டம்', icon: '�', description: 'வீட்டுத் தோட்டத்தில் செடிகள் வளர்த்த அனுபவம்' },
                    { file: 'ta/train.md', title: 'இரயில் பயணம்', icon: '🚂', description: 'இரயில் பயணத்தின் இனிய தருணங்கள்' }
                ]
            },
            kn: {
                name: 'ಕನ್ನಡ',
                essays: [
                    { file: 'kn/nanna-kutumba.md', title: 'ನನ್ನ ಕುಟುಂಬ', icon: '👨‍👩‍👧‍👦', description: 'ನನ್ನ ಅದ್ಭುತ ಕುಟುಂಬದ ಬಗ್ಗೆ ಕಥೆ' },
                    { file: 'kn/shaale-dinaa.md', title: 'ಶಾಲೆಯಲ್ಲಿ ಒಂದು ದಿನ', icon: '🏫', description: 'ಸಾಮಾನ್ಯ ಶಾಲೆಯ ದಿನದಲ್ಲಿ ಏನಾಗುತ್ತದೆ' }
                ]
            },
            te: {
                name: 'తెలుగు',
                essays: [
                    { file: 'te/train-journey.md', title: 'రైలు ప్రయాణం', icon: '�', description: 'అందమైన రైలు ప్రయాణ అనుభవం' },
                    { file: 'te/mountain-sunrise.md', title: 'రైనర్ శిఖరం వద్ద సూర్యోదయం', icon: '🌅', description: 'పర్వత శిఖరంపై అద్భుతమైన సూర్యోదయ దృశ్యం' },
                    { file: 'te/river-trail.md', title: 'సమ్మామిష్ నది బాట', icon: '🚴‍♂️', description: 'సైకిల్‌తో నది ఒడ్డున సాహసోపేత ప్రయాణం' },
                    { file: 'te/marymoor-park.md', title: 'మేరీమూర్ పార్క్', icon: '�️', description: 'కుటుంబంతో పార్కులో ఆనందమైన సమయం' },
                    { file: 'te/school-language-credits.md', title: 'ప్రపంచ భాషా క్రెడిట్‌లు', icon: '�', description: 'తెలుగు భాష విద్య మరియు పరీక్షల గురించి' }
                ]
            },
            mr: {
                name: 'मराठी',
                essays: [
                    { file: 'mr/mazha-kutumb.md', title: 'माझे कुटुंब', icon: '👨‍👩‍👧‍👦', description: 'माझ्या अद्भुत कुटुंबाबद्दलची गोष्ट' },
                    { file: 'mr/mazha-kutta.md', title: 'माझा कुत्रा', icon: '🐕', description: 'माझ्या केसाळ मित्रासोबतचे साहस' },
                    { file: 'mr/shaletil-divas.md', title: 'शाळेतील एक दिवस', icon: '🏫', description: 'सामान्य शालेय दिवसात काय घडते' },
                    { file: 'mr/mazhe-aavadateche-jevan.md', title: 'माझे आवडतेचे जेवण', icon: '🍕', description: 'माझ्या सर्वात प्रिय जेवणाबद्दल' },
                    { file: 'mr/unhaalya-suttya.md', title: 'उन्हाळ्याच्या सुट्या', icon: '🏖️', description: 'उन्हाळ्याच्या सुट्यांच्या मजेशीर आठवणी' }
                ]
            },
            en: {
                name: 'English',
                essays: [
                    { file: 'en/mountain-sunrise.md', title: 'Mountain Sunrise Adventure', icon: '🌅', description: 'An amazing sunrise experience on Mt. Rainier' },
                    { file: 'en/train-journey.md', title: 'Train Journey', icon: '�', description: 'Exciting train adventures and discoveries' },
                    { file: 'en/river-trail.md', title: 'River Trail Cycling', icon: '🚴‍♂️', description: 'Cycling adventures on the Sammamish River Trail' },
                    { file: 'en/marymoor-park.md', title: 'Marymoor Park Fun', icon: '�', description: 'Family activities and fun at Marymoor Park' },
                    { file: 'en/school-language-credits.md', title: 'World Language Credits', icon: '📚', description: 'Learning about language education and tests' }
                ]
            },
            hi: {
                name: 'हिन्दी',
                essays: [
                    { file: 'hi/mera-parivar.md', title: 'मेरा परिवार', icon: '👨‍👩‍👧‍👦', description: 'मेरे अद्भुत परिवार के बारे में कहानी' },
                    { file: 'hi/school-ka-din.md', title: 'स्कूल का एक दिन', icon: '🏫', description: 'एक सामान्य स्कूली दिन में क्या होता है' },
                    { file: 'hi/park-mein-din.md', title: 'पार्क में दिन', icon: '�', description: 'पार्क में बिताया गया एक खुशी का दिन' }
                ]
            }
        };
    }

    /**
     * Get essays configuration for a specific language
     * @param {string} language - Language code (en, es, fr, etc.)
     * @returns {Object} Essays configuration for the language
     */
    getEssaysForLanguage(language) {
        return this.essayConfigs[language] || this.essayConfigs.en;
    }

    /**
     * Fetch markdown content from local essays folder or GitHub Pages
     * @param {string} filePath - Path to the markdown file
     * @returns {Promise<string>} The markdown content
     */
    async fetchMarkdownContent(filePath) {
        try {
            let url;
            
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // Local development - use relative paths
                url = `./${this.contentPath}/${filePath}`;
            } else if (this.useGitHubPages && this.isConfigured()) {
                // GitHub Pages deployment
                url = `https://${this.githubUsername}.github.io/${this.repositoryName}/${this.contentPath}/${filePath}`;
            } else {
                // Fallback to relative path
                url = `./${this.contentPath}/${filePath}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain, text/markdown, */*',
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                // If file not found, return sample content
                if (response.status === 404) {
                    console.warn(`Essay file not found: ${url}`);
                    return this.getSampleContent(filePath);
                }
                throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
            }

            const content = await response.text();
            return content;
        } catch (error) {
            console.warn(`Failed to fetch ${filePath}, using sample content:`, error);
            return this.getSampleContent(filePath);
        }
    }

    /**
     * Generate sample content when GitHub repository is not available
     * @param {string} filePath - Path to the file
     * @returns {string} Sample markdown content
     */
    getSampleContent(filePath) {
        const filename = filePath.split('/').pop().replace('.md', '');
        
        const sampleContents = {
            // Tamil samples
            'en-kudumbam': `# என் குடும்பம்

என் குடும்பம் என் வாழ்க்கையில் மிக முக்கியமானது! 👨‍👩‍👧‍👦

## என் குடும்பத்தில் யார் யார் இருக்கிறார்கள்?

நான் என் **அம்மா**, **அப்பா**, மற்றும் என் சின்ன தங்கை சாரா உடன் வசிக்கிறேன். எங்களிடம் மேக்ஸ் என்று பெயரில் ஒரு கோல்டன் ரிட்ரீவர் நாய் உள்ளது!

### நாங்கள் ஒன்றாக செய்ய விரும்பும் விஷயங்கள்

- 🎮 ஞாயிற்றுக்கிழமை மாலையில் போர்டு கேம்ஸ் விளையாடுவது
- 🍳 சனிக்கிழமை காலையில் ஒன்றாக பான்கேக் செய்வது
- 🚗 பள்ளி விடுமுறையில் சாலைப் பயணம் செல்வது
- 📚 தூங்கும் முன் கதைகள் படிப்பது

## நான் ஏன் என் குடும்பத்தை விரும்புகிறேன்

என் குடும்பம் எப்போதும் என்னை ஆதரிக்கிறது மற்றும் என்னை சிரிக்க வைக்கிறது. நான் சோகமாக இருக்கும்போது, அவர்கள் என்னை உற்சாகப்படுத்துகிறார்கள்.

*குடும்பம் என்பது வாழ்க்கை தொடங்கும் இடம் மற்றும் அன்பு ஒருபோதும் முடியாத இடம்.* ❤️`,

            'en-naai': `# என் நாய்

உலகின் சிறந்த நாயைப் பற்றி உங்களுக்குச் சொல்கிறேன் - என் கோல்டன் ரிட்ரீவர் மேக்ஸ்! 🐕

## மேக்ஸைப் பற்றி

மேக்ஸுக்கு 3 வயதாகிறது மற்றும் மிக மென்மையான தங்க நிற ரோமங்கள் உள்ளன. அவன் என் செல்லப்பிராணி மட்டுமல்ல, என் சிறந்த நண்பன்!

### மேக்ஸ் விரும்பும் விஷயங்கள்

- 🎾 கொல்லைப்புறத்தில் பந்து விளையாட்டு
- 🦴 அவனது பிடித்த எலும்பை மெல்லுவது
- 💤 வெயில் படும் இடங்களில் உறங்குவது
- 🏃‍♂️ பூங்காவில் நடக்கச் செல்வது

மேக்ஸ் ஒவ்வொரு நாளும் நட்பு, பொறுப்பு மற்றும் நிபந்தனையற்ற அன்பைப் பற்றி கற்றுக் கொடுக்கிறான்! 🐾❤️`,

            // Hindi samples
            'mera-parivar': `# मेरा परिवार

मेरा परिवार मेरी जिंदगी की सबसे महत्वपूर्ण चीज है! 👨‍👩‍👧‍👦

## मेरे परिवार में कौन कौन है?

मैं अपनी **मम्मी**, **पापा**, और अपनी छोटी बहन सारा के साथ रहता हूँ। हमारे पास मैक्स नाम का एक गोल्डन रिट्रीवर कुत्ता भी है!

### हम एक साथ क्या करना पसंद करते हैं

- 🎮 रविवार की शाम को बोर्ड गेम्स खेलना
- 🍳 शनिवार की सुबह एक साथ पैनकेक बनाना
- 🚗 स्कूल की छुट्टियों में रोड ट्रिप पर जाना
- 📚 सोने से पहले कहानियाँ पढ़ना

मेरा परिवार हमेशा मेरा साथ देता है और मुझे हंसाता है।

*परिवार वह जगह है जहाँ जिंदगी शुरू होती है और प्यार कभी खत्म नहीं होता।* ❤️`,

            'mera-kutta': `# मेरा कुत्ता

दुनिया के सबसे अच्छे कुत्ते के बारे में बताता हूँ - मेरा गोल्डन रिट्रीवर मैक्स! 🐕

## मैक्स के बारे में

मैक्स 3 साल का है और उसके पास सबसे मुलायम सुनहरे बाल हैं। वह सिर्फ मेरा पालतू जानवर नहीं है, मेरा सबसे अच्छा दोस्त है!

### मैक्स को क्या पसंद है

- 🎾 आंगन में गेंद से खेलना
- 🦴 अपनी पसंदीदा हड्डी चबाना
- 💤 धूप वाली जगह पर सोना
- 🏃‍♂️ पार्क में टहलने जाना

मैक्स हर दिन मुझे दोस्ती, जिम्मेदारी और बिना शर्त प्यार के बारे में सिखाता है! 🐾❤️`,

            // English samples  
            'my-family': `# My Family

My family is the most important thing in my life! 👨‍👩‍👧‍👦

## Who's in My Family?

I live with my **mom**, **dad**, and my little sister Sarah. We also have a golden retriever named Max who is basically another family member!

### What We Love to Do Together

- 🎮 Play board games on Sunday evenings
- 🍳 Cook pancakes together on Saturday mornings  
- 🚗 Take road trips during school holidays
- 📚 Read bedtime stories (I still love them!)

## Why I Love My Family

My family always supports me and makes me laugh. When I'm sad, they cheer me up. When I'm happy, they celebrate with me. We might not be perfect, but we're perfect for each other!

*Family is where life begins and love never ends.* ❤️`,

            'my-pet': `# My Pet Dog

Let me tell you about the best dog in the whole world - my golden retriever Max! 🐕

## About Max

Max is 3 years old and has the fluffiest golden fur you've ever seen. He's not just my pet, he's my best friend!

### What Max Loves

- 🎾 Playing fetch in the backyard
- 🦴 Chewing on his favorite bone
- 💤 Napping in sunny spots
- 🏃‍♂️ Going for walks in the park

Max teaches me about friendship, responsibility, and unconditional love every day! 🐾❤️`,

            'school-day': `# A Day at School

School is such an adventure! Every day brings something new and exciting. Let me take you through my typical school day! 🏫

## Morning Time (8:00 AM)

The school bell rings and I rush to my classroom. I love seeing all my friends and our teacher, Mrs. Johnson, who always has a big smile on her face.

### First Period - Math 🔢

Math used to be tricky for me, but now I'm getting better at multiplication tables. Today we learned about fractions using pizza slices!

*Every day at school is a chance to learn something amazing!*`
        };

        return sampleContents[filename] || this.getDefaultSampleContent(filename);
    }

    /**
     * Get default sample content for unknown files
     * @param {string} filename - Name of the file
     * @returns {string} Default sample content
     */
    getDefaultSampleContent(filename) {
        return `# ${filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

This is a sample essay about ${filename.replace(/-/g, ' ')}. 

## Introduction

Welcome to this wonderful story! This is a placeholder content that shows how your essay would appear when loaded from GitHub.

## Main Content

Here you would write your amazing story or essay. The content supports:

- **Bold text**
- *Italic text*
- Lists and bullet points
- Headings and subheadings

## Conclusion

This is just sample content. To see your real essays, make sure to configure your GitHub repository settings in the \`github-content.js\` file.

*Happy reading!* 📚✨`;
    }

    /**
     * Check if GitHub repository is properly configured
     * @returns {boolean} True if configured, false otherwise
     */
    isConfigured() {
        return this.githubUsername !== 'your-github-username';
    }

    /**
     * Get configuration instructions for GitHub Pages hosting
     * @returns {string} HTML formatted instructions
     */
    getConfigurationInstructions() {
        return `
        <div class="config-instructions">
            <h3>� GitHub Pages Configuration</h3>
            <p>To set up your GitHub Pages website with essays:</p>
            <ol>
                <li><strong>Repository Setup:</strong>
                    <ul>
                        <li>Your website code and essays are in the same repository</li>
                        <li>Repository name should match your project (e.g., "kids-essays-website")</li>
                    </ul>
                </li>
                <li><strong>Create Essays Folder:</strong>
                    <ul>
                        <li>Create an "essays" folder in your repository root</li>
                        <li>Add language subfolders (en/, es/, fr/, etc.)</li>
                        <li>Add your markdown (.md) files</li>
                    </ul>
                </li>
                <li><strong>Enable GitHub Pages:</strong>
                    <ul>
                        <li>Go to Settings → Pages in your repository</li>
                        <li>Source: Deploy from a branch</li>
                        <li>Branch: main (or your default branch)</li>
                        <li>Folder: / (root)</li>
                        <li>Click Save</li>
                    </ul>
                </li>
                <li><strong>Update Configuration:</strong>
                    <ul>
                        <li>Edit <code>js/github-content.js</code></li>
                        <li>Update <code>githubUsername</code> and <code>repositoryName</code></li>
                    </ul>
                </li>
            </ol>
            
            <h4>📁 Expected Repository Structure:</h4>
            <pre>
your-repository/
├── index.html
├── css/
├── js/
├── essays/
│   ├── en/
│   │   ├── my-family.md
│   │   ├── my-pet.md
│   │   └── ...
│   ├── es/
│   │   ├── mi-familia.md
│   │   └── ...
│   └── fr/
│       ├── ma-famille.md
│       └── ...
└── README.md
            </pre>
            
            <p><strong>✨ Your website will be available at:</strong><br>
            <code>https://${this.githubUsername}.github.io/${this.repositoryName}</code></p>
            
            <p><strong>🔄 How to update content:</strong></p>
            <ul>
                <li>Edit markdown files directly in GitHub's web interface</li>
                <li>Changes appear on your website within minutes</li>
                <li>No build process needed - it's automatic!</li>
            </ul>
            
            <p><em>Currently showing sample content until configured and deployed.</em></p>
        </div>
        `;
    }

    /**
     * Get GitHub repository URL for easy access
     * @returns {string} GitHub repository URL
     */
    getRepositoryUrl() {
        if (this.isConfigured()) {
            return `https://github.com/${this.githubUsername}/${this.repositoryName}`;
        }
        return '#';
    }

    /**
     * Get direct edit URL for a specific essay
     * @param {string} filePath - Path to the essay file
     * @returns {string} GitHub edit URL
     */
    getEditUrl(filePath) {
        if (this.isConfigured()) {
            return `https://github.com/${this.githubUsername}/${this.repositoryName}/edit/${this.branch}/${this.contentPath}/${filePath}`;
        }
        return '#';
    }
}

// Export for use in main application
window.GitHubContentService = GitHubContentService;