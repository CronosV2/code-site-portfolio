export default function Page() {
  return <div>
  <div style={{
      padding: '2rem',
      fontFamily: 'system-ui',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
    <h1 style={{
        color: '#6366f1',
        marginBottom: '1rem'
      }}>📧 Contact</h1>
    <VCard title="Contactez-nous" description="Remplissez ce formulaire pour nous contacter">
      <form style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
        <VInput label="Nom" type="text" placeholder="Votre nom" required />
        
        <VInput label="Email" type="email" placeholder="votre@email.com" helperText="Nous ne partagerons jamais votre email" required />
        
        <div>
          <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#334155',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}>
            Message
          </label>
          <textarea rows={5} style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontFamily: 'inherit'
            }} placeholder="Votre message..." required />
        </div>

        <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
          <VButton variant="primary" size="md" type="submit">
            Envoyer
          </VButton>
          <VButton variant="secondary" size="md" type="button" onClick={() => window.location.href = '/'}>
            Annuler
          </VButton>
        </div>
      </form>
    </VCard>

    <div style={{
        marginTop: '2rem'
      }}>
      <VButton variant="secondary" onClick={() => window.location.href = '/'}>
        ← Retour à l'accueil
      </VButton>
    </div>
  </div>
  </div>;
}