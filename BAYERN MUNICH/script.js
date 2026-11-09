
document.addEventListener("DOMContentLoaded", function () {

  // =====================================
  // TIXLY CONFIGURATION
  // =====================================

  const REGULAR_PRICE = 1200;
  const VIP_PRICE = 2300;

  const PAYMENT_DETAILS = {
    mpesa: "0181580414",
    paypal: "centraljoke@gmail.com"
  };

  const $ = (id) => document.getElementById(id);

  // =====================================
  // MOBILE NAVIGATION
  // =====================================

  const menuToggle = $("menuToggle");
  const mainNav = $("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
      menuToggle.textContent =
        mainNav.classList.contains("open") ? "✕" : "☰";
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuToggle.textContent = "☰";
      });
    });
  }

  // =====================================
  // FOOTER YEAR
  // =====================================

  if ($("year")) {
    $("year").textContent = new Date().getFullYear();
  }

  // =====================================
  // TOAST NOTIFICATION
  // =====================================

  function showToast(message) {
    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // =====================================
  // MATCH FILTERS
  // =====================================

  const filterButtons =
    document.querySelectorAll(".filter-btn");

  const matchCards =
    document.querySelectorAll(".match-card");

  filterButtons.forEach(button => {

    button.addEventListener("click", function () {

      filterButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      this.classList.add("active");

      const filter = this.dataset.filter;

      matchCards.forEach(card => {

        const category = card.dataset.league;

        card.style.display =
          filter === "all" || category === filter
            ? ""
            : "none";

      });

    });

  });

  // =====================================
  // BOOK MATCH BUTTONS
  // =====================================

  const matchButtons =
    document.querySelectorAll(".book-match");

  const matchSelect = $("match");

  matchButtons.forEach(button => {

    button.addEventListener("click", function () {

      const selectedMatch = this.dataset.match;

      if (matchSelect) {
        matchSelect.value = selectedMatch;
      }

      updateSummary();

      $("booking")?.scrollIntoView({
        behavior: "smooth"
      });

      showToast("Match selected: " + selectedMatch);

    });

  });

  // =====================================
  // BOOKING ELEMENTS
  // =====================================

  const bookingForm = $("bookingForm");

  const ticketType = $("ticketType");
  const quantity = $("quantity");
  const paymentMethod = $("paymentMethod");

  const summaryMatch = $("summaryMatch");
  const summaryCategory = $("summaryCategory");
  const summaryPrice = $("summaryPrice");
  const summaryTotal = $("summaryTotal");

  const previewMatch = $("previewMatch");
  const paymentInfo = $("paymentInfo");

  // =====================================
  // PRICE CALCULATOR
  // =====================================

  function getTicketPrice() {

    if (!ticketType) return REGULAR_PRICE;

    return ticketType.value === "VIP"
      ? VIP_PRICE
      : REGULAR_PRICE;

  }

  function updateSummary() {

    const selectedMatch =
      matchSelect?.value || "Bayern Munich vs Ajax";

    const selectedType =
      ticketType?.value || "Regular";

    const selectedQuantity =
      Number(quantity?.value || 1);

    const unitPrice = getTicketPrice();

    const total = unitPrice * selectedQuantity;

    if (summaryMatch) {
      summaryMatch.textContent = selectedMatch;
    }

    if (summaryCategory) {
      summaryCategory.textContent =
        selectedType + " Ticket × " + selectedQuantity;
    }

    if (summaryPrice) {
      summaryPrice.textContent =
        "KES " + unitPrice.toLocaleString("en-KE");
    }

    if (summaryTotal) {
      summaryTotal.textContent =
        "KES " + total.toLocaleString("en-KE");
    }

    if (previewMatch) {
      previewMatch.textContent =
        selectedMatch.toUpperCase();
    }

    return total;

  }

  [ticketType, quantity, matchSelect].forEach(element => {

    if (element) {
      element.addEventListener("change", updateSummary);
    }

  });

  updateSummary();

  // =====================================
  // PAYMENT METHOD DISPLAY
  // =====================================

  function updatePaymentInfo() {

    if (!paymentMethod || !paymentInfo) return;

    if (paymentMethod.value === "M-Pesa") {

      paymentInfo.innerHTML = `
        <div class="payment-icon">M</div>
        <div>
          <b>M-Pesa Payment Instructions</b>
          <p>
            Payment number:
            <strong>${PAYMENT_DETAILS.mpesa}</strong>.
            Verify the recipient with the event organizer
            before sending money.
          </p>
        </div>
      `;

    } else {

      paymentInfo.innerHTML = `
        <div class="payment-icon">P</div>
        <div>
          <b>PayPal Payment Instructions</b>
          <p>
            PayPal account:
            <strong>${PAYMENT_DETAILS.paypal}</strong>.
            Verify the account and payment before proceeding.
          </p>
        </div>
      `;

    }

  }

  if (paymentMethod) {
    paymentMethod.addEventListener(
      "change",
      updatePaymentInfo
    );
  }

  updatePaymentInfo();

  // =====================================
  // GENERATE SAMPLE TICKET NUMBER
  // =====================================

  function generateTicketNumber() {

    const random = Math.floor(
      100000 + Math.random() * 900000
    );

    return "TIX-DEMO-" + random;

  }

  // =====================================
  // CREATE TICKET RECEIPT
  // =====================================

  function generateReceipt(data) {

    const ticketNumber = generateTicketNumber();

    const total =
      data.price * data.quantity;

    const receipt = $("ticketReceipt");

    if (!receipt) return;

    receipt.innerHTML = `

      <div class="receipt-stamp">
        SAMPLE RECEIPT — NOT VALID FOR ENTRY
      </div>

      <h4>TIXLY FOOTBALL TICKET</h4>

      <p><strong>Ticket Number:</strong>
        ${ticketNumber}
      </p>

      <p><strong>Customer Name:</strong>
        ${escapeHTML(data.fullName)}
      </p>

      <p><strong>Email:</strong>
        ${escapeHTML(data.email)}
      </p>

      <p><strong>Contact:</strong>
        ${escapeHTML(data.phone)}
      </p>

      <p><strong>Match:</strong>
        ${escapeHTML(data.match)}
      </p>

      <p><strong>Ticket Category:</strong>
        ${escapeHTML(data.ticketType)}
      </p>

      <p><strong>Quantity:</strong>
        ${data.quantity}
      </p>

      <p><strong>Payment Method:</strong>
        ${escapeHTML(data.paymentMethod)}
      </p>

      <p><strong>Payment Reference:</strong>
        ${escapeHTML(data.paymentReference || "Not supplied")}
      </p>

      <p><strong>Total Amount:</strong>
        KES ${total.toLocaleString("en-KE")}
      </p>

      <p><strong>Booking Date:</strong>
        ${new Date().toLocaleString("en-KE")}
      </p>

      <hr>

      <p>
        This is a sample booking receipt.
        It does not confirm payment or grant stadium entry.
      </p>

    `;

    return ticketNumber;

  }

  // =====================================
  // HTML SECURITY
  // =====================================

  function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];

    });

  }

  // =====================================
  // SUBMIT BOOKING
  // =====================================

  if (bookingForm) {

    bookingForm.addEventListener("submit", function (event) {

      event.preventDefault();

      if (!bookingForm.reportValidity()) {
        return;
      }

      const fullName =
        $("fullName").value.trim();

      const email =
        $("email").value.trim();

      const phone =
        $("phone").value.trim();

      const match =
        $("match").value;

      const selectedTicket =
        $("ticketType").value;

      const selectedQuantity =
        Number($("quantity").value);

      const selectedPayment =
        $("paymentMethod").value;

      const paymentReference =
        $("paymentReference").value.trim();

      if (!fullName || !email || !phone) {

        showToast("Please complete all required fields.");

        return;

      }

      const booking = {

        fullName,
        email,
        phone,
        match,
        ticketType: selectedTicket,
        quantity: selectedQuantity,
        price: getTicketPrice(),
        paymentMethod: selectedPayment,
        paymentReference

      };

      // Generate a SAMPLE receipt.
      // This does not verify payment or send email.

      generateReceipt(booking);

      const successPanel = $("successPanel");

      if (successPanel) {

        successPanel.hidden = false;

        $("successMessage").textContent =
          "Your booking details have been submitted in this demo. " +
          "A sample receipt is displayed below. No email has been sent.";

        successPanel.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

      showToast("Sample booking submitted successfully!");

    });

  }

  // =====================================
  // PRINT / SAVE TICKET
  // =====================================

  const printButton = $("printTicket");

  if (printButton) {

    printButton.addEventListener("click", function () {

      window.print();

    });

  }

  // =====================================
  // NEW BOOKING
  // =====================================

  const newBookingButton = $("newBooking");

  if (newBookingButton) {

    newBookingButton.addEventListener("click", function () {

      bookingForm.reset();

      $("successPanel").hidden = true;

      updateSummary();
      updatePaymentInfo();

      $("booking").scrollIntoView({
        behavior: "smooth"
      });

      showToast("You can make another sample booking.");

    });

  }

});
