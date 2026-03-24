# 🚂 RailBondhu - বাস্তব ডিপ্লয়মেন্ট গাইড

## 📌 সংক্ষিপ্ত বিবরণ

এই গাইডটি অনুসরণ করে আপনি RailBondhu ওয়েবসাইটটি বাস্তবে ব্যবহারের জন্য অনলাইনে আনতে পারবেন।

---

## 🔑 প্রয়োজনীয় একাউন্ট এবং খরচ

| সার্ভিস | খরচ | কাজ | লিংক |
|---------|------|-----|------|
| GitHub | ফ্রি | কোড সংরক্ষণ | github.com |
| Vercel | ফ্রি | ওয়েবসাইট হোস্টিং | vercel.com |
| Supabase | ফ্রি | ডাটাবেস | supabase.com |

**মোট খরচ: ০ টাকা (সব ফ্রি টিয়ার)**

---

## 📝 ধাপ ১: GitHub একাউন্ট এবং রিপোজিটরি

### ১.১ GitHub একাউন্ট খুলুন
1. https://github.com যান
2. "Sign up" এ ক্লিক করুন
3. Email, password দিন
4. Email ভেরিফাই করুন

### ১.২ নতুন রিপোজিটরি তৈরি করুন
1. GitHub এ লগইন করুন
2. "New repository" এ ক্লিক করুন
3. Repository name: `railbondhu`
4. "Private" সিলেক্ট করুন (ব্যক্তিগত)
5. "Create repository" এ ক্লিক করুন

### ১.৩ কোড আপলোড করুন
```bash
# আপনার কম্পিউটারে এই কমান্ডগুলো রান করুন
git init
git add .
git commit -m "Initial commit - RailBondhu"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/railbondhu.git
git push -u origin main
```

---

## 🗄️ ধাপ ২: Supabase ডাটাবেস সেটআপ

### ২.১ Supabase একাউন্ট খুলুন
1. https://supabase.com যান
2. "Start your project" এ ক্লিক করুন
3. GitHub দিয়ে সাইন ইন করুন (সহজ)

### ২.২ নতুন প্রজেক্ট তৈরি করুন
1. "New Project" এ ক্লিক করুন
2. Organization: নতুন তৈরি করুন
3. Project name: `railbondhu`
4. Database password: শক্তিশালী পাসওয়ার্ড দিন (সংরক্ষণ করুন!)
5. Region: `Southeast Asia (Singapore)` সিলেক্ট করুন
6. "Create new project" এ ক্লিক করুন

### ২.৩ ডাটাবেস কানেকশন স্ট্রিং পান
1. Project Settings > Database যান
2. "Connection string" কপি করুন
3. এটি দেখতে এমন হবে:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### ২.৪ টেবিল তৈরি করুন
1. SQL Editor এ যান
2. `prisma/schema.prisma` ফাইলের টেবিলগুলো তৈরি করুন
3. অথবা Prisma migrate ব্যবহার করুন

---

## 🚀 ধাপ ৩: Vercel ডিপ্লয়মেন্ট

### ৩.১ Vercel একাউন্ট খুলুন
1. https://vercel.com যান
2. "Sign Up" এ ক্লিক করুন
3. GitHub দিয়ে সাইন ইন করুন (সহজ)

### ৩.২ প্রজেক্ট ইম্পোর্ট করুন
1. "Add New..." > "Project" এ ক্লিক করুন
2. GitHub রিপোজিটরি `railbondhu` সিলেক্ট করুন
3. "Import" এ ক্লিক করুন

### ৩.৩ এনভায়রনমেন্ট ভেরিয়েবল সেট করুন
"Environment Variables" সেকশনে এইগুলো যোগ করুন:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

NEXTAUTH_URL=https://your-app.vercel.app

NEXTAUTH_SECRET=random-32-character-string

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### ৩.৪ ডিপ্লয় করুন
1. "Deploy" এ ক্লিক করুন
2. ২-৩ মিনিট অপেক্ষা করুন
3. আপনার সাইট তৈরি! 🎉

---

## ⚡ ধাপ ৪: Socket.IO সার্ভার (চ্যাট এবং লাইভ লোকেশন)

### অপশন ১: Railway (সহজ)
1. https://railway.app যান
2. GitHub দিয়ে সাইন ইন করুন
3. "New Project" > "Deploy from GitHub repo"
4. `mini-services/socket-service` ফোল্ডার সিলেক্ট করুন
5. Deploy করুন

### অপশন ২: Render (ফ্রি)
1. https://render.com যান
2. "New" > "Web Service" সিলেক্ট করুন
3. GitHub রিপো কানেক্ট করুন
4. Root Directory: `mini-services/socket-service`
5. Build Command: `bun install`
6. Start Command: `bun index.ts`

---

## 📱 ধাপ ৫: ট্রেন ডাটা যোগ করা

### বাংলাদেশ রেলওয়ের ডাটা যোগ করুন

ডাটাবেসে ট্রেন, স্টেশন এবং রুটের তথ্য যোগ করতে হবে:

1. **স্টেশন ডাটা:**
   - ঢাকা, চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা ইত্যাদি

2. **ট্রেন ডাটা:**
   - সুবর্ণ এক্সপ্রেস, মহানগর প্রভাতী, পারাবত এক্সপ্রেস ইত্যাদি

3. **রুট ডাটা:**
   - কোন ট্রেন কোন স্টেশন দিয়ে যায়

---

## 🔐 ধাপ ৬: অথেন্টিকেশন সেটআপ

### Google OAuth (ঐচ্ছিক)
1. Google Cloud Console যান
2. "OAuth 2.0 Client ID" তৈরি করুন
3. Authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

---

## ✅ চেকলিস্ট

- [ ] GitHub একাউন্ট তৈরি
- [ ] GitHub এ কোড আপলোড
- [ ] Supabase একাউন্ট তৈরি
- [ ] Supabase ডাটাবেস তৈরি
- [ ] Vercel একাউন্ট তৈরি
- [ ] Vercel এ প্রজেক্ট ডিপ্লয়
- [ ] Environment variables সেট
- [ ] Socket.IO সার্ভার ডিপ্লয়
- [ ] ট্রেন ডাটা যোগ
- [ ] টেস্টিং

---

## 📊 কাজের অগ্রগতি

### আমি যা করেছি (৮৫%):
- ✅ সম্পূর্ণ ফ্রন্টএন্ড UI
- ✅ ব্যাকএন্ড API রুট
- ✅ ডাটাবেস স্কিমা
- ✅ Socket.IO চ্যাট সার্ভার
- ✅ ম্যাপ ইন্টিগ্রেশন
- ✅ মোবাইল রেসপন্সিভ ডিজাইন
- ✅ বাংলা ভাষা সাপোর্ট

### আপনাকে যা করতে হবে (১৫%):
- 📝 একাউন্ট খোলা (GitHub, Vercel, Supabase)
- 📝 ডাটাবেসে ট্রেন/স্টেশন ডাটা যোগ
- 📝 Socket.IO সার্ভার আলাদাভাবে ডিপ্লয়
- 📝 ডোমেইন কানেক্ট (ঐচ্ছিক)

---

## 🆘 সাহায্য

যেকোনো সমস্যায় আমাকে জিজ্ঞাসা করুন। আমি প্রতিটি ধাপে সাহায্য করতে পারব।

---

**শুভকামনা! 🚂🇧🇩**
