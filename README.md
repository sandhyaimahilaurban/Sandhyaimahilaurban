# SandhyaiMahilaUrban-website.
Yes. Since your website is just **HTML + CSS**, hosting it on **AWS EC2 + Nginx** is straightforward.

### Architecture

```text
User Browser
     │
     │ HTTP / HTTPS
     ▼
AWS EC2 Instance
     │
     ▼
Nginx Web Server
     │
     ├── /var/www/sandhyai/index.html
     └── /var/www/sandhyai/style.css
```

## 1. Launch EC2

In AWS:

1. Go to **EC2 → Launch Instance**
2. Name: `sandhyai-web-server`
3. AMI: **Ubuntu Server 24.04 LTS**
4. Instance type: `t2.micro` or `t3.micro`
5. Create/select a key pair.
6. Configure Security Group:

| Type  | Port | Source    |
| ----- | ---: | --------- |
| SSH   |   22 | My IP     |
| HTTP  |   80 | 0.0.0.0/0 |
| HTTPS |  443 | 0.0.0.0/0 |

For security, **don't open SSH (22) to `0.0.0.0/0`**.

---

## 2. Connect to EC2

From your Windows terminal:

```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

For example:

```bash
ssh -i "sandhyai.pem" ubuntu@13.200.xx.xx
```

---

## 3. Install Nginx

Run:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install nginx -y
```

Check:

```bash
sudo systemctl status nginx
```

You should see:

```text
Active: active (running)
```

Now open:

```text
http://YOUR_EC2_PUBLIC_IP
```

You should see the **Nginx welcome page**.

---

## 4. Create your website directory

```bash
sudo mkdir -p /var/www/sandhyai
```

Give Ubuntu ownership:

```bash
sudo chown -R ubuntu:ubuntu /var/www/sandhyai
```

---

## 5. Upload your HTML and CSS

Your local project is:

```text
sandhyai-website/
│
├── index.html
└── style.css
```

From your **Windows PC**, you can use SCP:

```bash
scp -i "sandhyai.pem" index.html ubuntu@YOUR_EC2_PUBLIC_IP:/var/www/sandhyai/
```

Then:

```bash
scp -i "sandhyai.pem" style.css ubuntu@YOUR_EC2_PUBLIC_IP:/var/www/sandhyai/
```

Or upload both files using **WinSCP**, which is easier if you're not comfortable with SCP.

---

## 6. Configure Nginx

Create a site configuration:

```bash
sudo nano /etc/nginx/sites-available/sandhyai
```

Put this inside:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/sandhyai;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

Save:

```text
CTRL + O
ENTER
CTRL + X
```

---

## 7. Enable the website

Run:

```bash
sudo ln -s /etc/nginx/sites-available/sandhyai /etc/nginx/sites-enabled/
```

Remove the default Nginx site:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

Test the configuration:

```bash
sudo nginx -t
```

You should get:

```text
syntax is ok
test is successful
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## 8. Open your website

Go to:

```text
http://YOUR_EC2_PUBLIC_IP
```

For example:

```text
http://13.200.100.50
```

Your Sandhyai website should now load.

---

# 9. If you have a domain

If you want:

```text
www.sandhyaiurban.com
```

instead of:

```text
13.200.100.50
```

you need to point your domain's DNS to the EC2 server.

A better architecture is:

```text
                    Internet
                       │
                       ▼
              sandhyaiurban.com
                       │
                       ▼
                 DNS / Route 53
                       │
                       ▼
                 EC2 Public IP
                       │
                       ▼
                    Nginx
                       │
                       ▼
             /var/www/sandhyai
                       │
             ┌─────────┴─────────┐
             │                   │
         index.html          style.css
```

### Important

For a production website, I recommend using an **AWS Elastic IP** rather than relying on the EC2 public IP. Otherwise, the public IP can change when the instance is stopped/started.

---

# 10. Add HTTPS/SSL

Once your domain is pointing to EC2, install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Then:

```bash
sudo certbot --nginx -d sandhyaiurban.com -d www.sandhyaiurban.com
```

Certbot will configure HTTPS for you.

Your final website becomes:

```text
https://sandhyaiurban.com
```

instead of:

```text
http://YOUR_EC2_PUBLIC_IP
```

---

## Recommended production setup

For your Sandhyai project, I'd use:

```text
                  ┌─────────────────┐
                  │     User        │
                  │ Browser/Mobile  │
                  └────────┬────────┘
                           │
                         HTTPS
                           │
                           ▼
                  ┌─────────────────┐
                  │  Domain / DNS   │
                  │ Route 53        │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   AWS EC2       │
                  │ Ubuntu 24.04    │
                  ├─────────────────┤
                  │     Nginx       │
                  ├─────────────────┤
                  │  /var/www/      │
                  │    sandhyai/    │
                  ├─────────────────┤
                  │  index.html     │
                  │  style.css      │
                  └─────────────────┘
