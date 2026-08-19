(() => {
  const BANNER_ID = "bhajan-geetam-banner";

  function createBanner() {
    const banner = document.createElement("div");
    banner.id = BANNER_ID;
    banner.className = "bhajan-geetam-banner";
    banner.setAttribute("aria-labelledby", "bhajan-geetam-title");

    const ornament = document.createElement("span");
    ornament.className = "bhajan-geetam-ornament";
    ornament.setAttribute("aria-hidden", "true");
    ornament.textContent = "◆";

    const title = document.createElement("h3");
    title.id = "bhajan-geetam-title";
    title.textContent = "गीतं मधुरम्";

    const introduction = document.createElement("p");
    introduction.className = "bhajan-geetam-attribution";
    introduction.textContent =
      "जैसा कि परम पूज्य स्वामीजी के एक आदरणीय वरिष्ठ एवं निकट शिष्य ने लिखा—";

    const quote = document.createElement("blockquote");
    quote.textContent =
      "—“परम पूज्य गुरुवर को निःसंदेह सृजन का संगीत अत्यंत प्रिय था। वे विध्वंस की कर्कश स्वर-लहरियों में छिपी सृजन की मधुरता के प्रेमी थे।”";

    const closing = document.createElement("p");
    closing.className = "bhajan-geetam-introduction";
    closing.textContent =
      "परम पूज्य स्वामीजी के भक्ति-भाव से परिपूर्ण मधुर कीर्तन हमारे हृदय के किसी कोने में दबी-छिपी भक्ति को सहज ही उजागर कर देते हैं।";

    const heart = document.createElement("span");
    heart.className = "bhajan-geetam-heart";
    heart.setAttribute("aria-label", "प्रेम");
    heart.textContent = "❤️";
    closing.append(" ", heart);

    const devoteeAttribution = document.createElement("p");
    devoteeAttribution.className = "bhajan-geetam-devotee-attribution";
    devoteeAttribution.textContent = "— एक भक्त के उद्गार";

    banner.append(
      ornament,
      title,
      closing,
      devoteeAttribution,
      introduction,
      quote
    );
    return banner;
  }

  function installBanner() {
    if (document.getElementById(BANNER_ID)) return true;

    const section = document.getElementById("bhajans");
    if (!section) return false;

    const heading = section.querySelector(".text-center.mb-12, .text-center.mb-8");
    if (!heading) return false;

    heading.querySelectorAll("p").forEach((paragraph) => {
      if (
        paragraph.textContent.trim() ===
        "Soul-stirring devotional songs sung in Pujya Swamiji's satsangs"
      ) {
        paragraph.remove();
      }
    });

    heading.insertAdjacentElement("afterend", createBanner());
    return true;
  }

  function start() {
    if (installBanner()) return;

    const observer = new MutationObserver(() => {
      if (installBanner()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
