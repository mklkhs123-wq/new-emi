# Smart Finance App — Final Complete

This is the final complete package including:
- EMI, FD, SIP, RD, PPF calculators (fully working client-side)
- Currency converter (exchangerate.host) — live rates (no API key)
- Finance news (Google News RSS via AllOrigins proxy)
- Indian Finance Companies list with links
- Loan eligibility checker with apply link
- Payment / UPI section with QR (SVG) and UPI deep link
- Privacy policy modal
- Responsive, mobile-friendly UI ready for WebView or GitHub Pages

## How to run locally (recommended)
1. Extract the ZIP.
2. In the folder run:
   ```bash
   python -m http.server 8000
   ```
3. Open http://localhost:8000

## Notes
- Currency & news require network access; if blocked by CORS, try hosting on GitHub Pages or use a server-side proxy.
- Replace `example@upi` in `app.js` with your real UPI ID to receive payments.
