# RailBondhu ডিপ্লয়মেন্ট গাইড

## সম্পূর্ণ ফ্রি ডিপ্লয়মেন্ট প্রক্রিয়া

---

## ধাপ ১: প্রয়োজনীয় অ্যাকাউন্ট তৈরি

### ১.১ GitHub অ্যাকাউন্ট (ফ্রি)
1. https://github.com যান
2. "Sign Up" এ ক্লিক
3. Email, Username, Password দিন
4. Email ভেরিফিকেশন করুন

### ১.২ Vercel অ্যাকাউন্ট (ফ্রি)
1. https://vercel.com যান
2. "Sign Up" এ ক্লিক
3. "Continue with GitHub" সিলেক্ট করুন
4. GitHub অনুমতি দিন

### ১.৩ Supabase অ্যাকাউন্ট (ফ্রি PostgreSQL ডাটাবেস)
1. https://supabase.com যান
2. "Start your project" এ ক্লিক
3. GitHub দিয়ে সাইন আপ করুন
4. নতুন প্রজেক্ট তৈরি করুন:
   - Name: railbondhu
   - Database Password: শক্তিশালী পাসওয়ার্ড দিন (মনে রাখবেন!)
   - Region: Singapore (ভারতের কাছাকাছি)
5. প্রজেক্ট তৈরি হলে Database Settings থেকে Connection String কপি করুন

---

## ধাপ ২: GitHub-এ কোড পুশ করা

### ২.১ GitHub-এ Repository তৈরি
1. GitHub এ লগইন করুন
2. উপরে ডানে "+" → "New repository"
3. Repository name: `railbondhu`
4. "Public" সিলেক্ট করুন
5. "Create repository" এ ক্লিক

### ২.২ লোকাল থেকে পুশ করুন
আপনার কম্পিউটারে Terminal খুলে নিচের কমান্ডগুলো রান করুন:

```bash
# প্রজেক্ট ফোল্ডারে যান
cd /path/to/railbondhu

# GitHub remote যোগ করুন (আপনার username দিন)
git remote add origin https://github.com/YOUR_USERNAME/railbondhu.git

# সব পরিবর্তন সংরক্ষণ করুন
git add .
git commit -m "Initial commit - RailBondhu train tracking app"

# GitHub-এ পুশ করুন
git push -u origin master
```

---

## ধাপ ৩: Vercel-এ ডিপ্লয় করা

### ৩.১ Vercel-এ প্রজেক্ট ইম্পোর্ট
1. https://vercel.com এ লগইন করুন
2. "Add New..." → "Project" এ ক্লিক
3. "Import Git Repository" সেকশনে আপনার `railbondhu` repo খুঁজুন
4. "Import" এ ক্লিক করুন

### ৩.২ Environment Variables সেট করুন
Vercel-এ "Environment Variables" সেকশনে নিচের ভেরিয়েবলগুলো যোগ করুন:

```env
# Database (Supabase থেকে পাবেন)
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# NextAuth.js Secret (নিচের কমান্ড দিয়ে তৈরি করুন)
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://your-app-name.vercel.app

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### ৩.৩ NEXTAUTH_SECRET তৈরি করুন
Terminal-এ রান করুন:
```bash
openssl rand -base64 32
```
এটি একটি র্যান্ডম সিক্রেট দেবে, সেটি কপি করে `NEXTAUTH_SECRET` এ বসান।

### ৩.৪ Deploy করুন
1. "Deploy" বাটনে ক্লিক করুন
2. 2-3 মিনিট অপেক্ষা করুন
3. সাফল্যের পর আপনার সাইটের URL পাবেন!

---

## ধাপ ৪: ডাটাবেস সেটআপ

### ৪.১ Prisma মাইগ্রেশন রান করুন
Vercel ডিপ্লয়মেন্ট সম্পন্ন হওয়ার পর:

1. Vercel Dashboard → আপনার প্রজেক্ট → "Settings" → "Environment Variables"
2. নিশ্চিত করুন DATABASE_URL সঠিকভাবে সেট করা আছে

3. লোকাল কম্পিউটার থেকে (অথবা Vercel CLI দিয়ে):
```bash
# Prisma ক্লায়েন্ট জেনারেট করুন
npx prisma generate

# ডাটাবেস সিঙ্ক করুন
npx prisma db push
```

---

## ফ্রি টিয়ার লিমিট সমূহ

| সার্ভিস | ফ্রি লিমিট | মন্তব্য |
|---------|-----------|---------|
| Vercel | 100GB Bandwidth/মাস | ছোট-মাঝারি অ্যাপের জন্য যথেষ্ট |
| Supabase | 500MB Database | শুরুতে যথেষ্ট |
| Supabase | 1GB Storage | ছবি/ফাইলের জন্য |
| Supabase | 50,000 Monthly Active Users | বাংলাদেশের জন্য যথেষ্ট |

---

## আপনার সাইটের URL

ডিপ্লয়মেন্ট সম্পন্ন হলে আপনি পাবেন:
- `https://railbondhu.vercel.app` (অথবা আপনার নাম)
- Custom Domain যোগ করতে পারবেন (ফ্রি)

---

## সমস্যা হলে

### Build Error
- Vercel Build Logs চেক করুন
- Environment Variables সঠিক কিনা দেখুন

### Database Error
- Supabase Dashboard এ ডাটাবেস চলছে কিনা দেখুন
- Connection String সঠিক কিনা চেক করুন

### 404 Error
- `vercel.json` ফাইল যোগ করতে হতে পারে

---

## পরবর্তী ধাপ

ডিপ্লয়মেন্ট সম্পন্ন হলে:
1. ✅ সাইট টেস্ট করুন
2. ✅ Bangladesh Railway API ইন্টিগ্রেশন
3. ✅ Payment Gateway (bKash/Nagad)
4. ✅ Custom Domain যোগ
5. ✅ Analytics সেটআপ

---

**ভালো লাগবে আপনার সাইট লঞ্চ করতে! 🚀**
