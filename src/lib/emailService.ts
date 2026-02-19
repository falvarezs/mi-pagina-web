type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const RESEND_API_URL = 'https://api.resend.com/emails';

const getResendKey = () => import.meta.env.VITE_RESEND_API_KEY as string | undefined;
const getSender = () => (import.meta.env.VITE_EMAIL_SENDER as string | undefined) ?? 'Academia Karolain <no-reply@karolainrondon.com>';

const sendWithResend = async ({ to, subject, html }: EmailPayload) => {
  const apiKey = getResendKey();
  if (!apiKey) {
    return { ok: false, reason: 'NO_API_KEY' as const };
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: getSender(),
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    return { ok: false, reason: 'REQUEST_FAILED' as const };
  }

  return { ok: true as const };
};

const mailtoFallback = (to: string, subject: string, body: string) => {
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailto, '_blank');
};

export const sendPaymentReceivedEmail = async ({
  to,
  name,
  courseTitle,
  amount,
  paymentMethod,
}: {
  to: string;
  name: string;
  courseTitle: string;
  amount: string;
  paymentMethod: string;
}) => {
  const subject = `Recibimos tu solicitud de compra - ${courseTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <h2>¡Hola ${name}!</h2>
      <p>Recibimos tu solicitud para el curso <strong>${courseTitle}</strong>.</p>
      <p><strong>Método de pago:</strong> ${paymentMethod}</p>
      <p><strong>Monto:</strong> ${amount}</p>
      <p>Verificaremos tu comprobante en un máximo de 24-48 horas hábiles.</p>
      <p>Gracias por confiar en la Academia de Repostería de Karolain Rondon.</p>
    </div>
  `;

  const result = await sendWithResend({ to, subject, html });
  if (!result.ok) {
    mailtoFallback(to, subject, `Hola ${name}, recibimos tu solicitud para ${courseTitle}. Verificaremos tu pago en 24-48 horas.`);
  }
};

export const sendPaymentApprovedEmail = async ({
  to,
  name,
  courseTitle,
}: {
  to: string;
  name: string;
  courseTitle: string;
}) => {
  const subject = `✅ Tu curso ya está disponible - ${courseTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <h2>¡Hola ${name}!</h2>
      <p>Tu pago fue confirmado y el curso <strong>${courseTitle}</strong> ya está disponible.</p>
      <p>Ingresa a tu panel para empezar.</p>
      <p>¡Bienvenida a la Academia de Repostería de Karolain Rondon!</p>
    </div>
  `;

  const result = await sendWithResend({ to, subject, html });
  if (!result.ok) {
    mailtoFallback(to, subject, `Hola ${name}, tu pago fue aprobado y el curso ${courseTitle} ya está disponible.`);
  }
};

export const sendPaymentRejectedEmail = async ({
  to,
  name,
  courseTitle,
}: {
  to: string;
  name: string;
  courseTitle: string;
}) => {
  const subject = `Necesitamos verificar tu pago - ${courseTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <h2>Hola ${name},</h2>
      <p>No pudimos validar el comprobante para el curso <strong>${courseTitle}</strong>.</p>
      <p>Por favor, envíanos un comprobante legible o contáctanos por WhatsApp.</p>
      <p>Estamos para ayudarte.</p>
    </div>
  `;

  const result = await sendWithResend({ to, subject, html });
  if (!result.ok) {
    mailtoFallback(to, subject, `Hola ${name}, necesitamos verificar tu comprobante para ${courseTitle}.`);
  }
};
