import React, { useState } from 'react';
import { TonConnectUIProvider, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { TonConnectButton } from '@tonconnect/ui-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Form, Row } from 'react-bootstrap';

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendTransaction = async () => {
    setLoading(true);
    setError('');
    setTxHash('');

    try {
      const nanoTON = Math.floor(parseFloat(amount) * 1e9);
      if (!recipient || !nanoTON || isNaN(nanoTON)) {
        setError('Recipient or amount is invalid.');
        setLoading(false);
        return;
      }

      const transaction = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: recipient,
            amount: nanoTON.toString(),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      setTxHash(result.boc);
    } catch (err) {
      setError('Error on send transaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container className='p-4'>
      <Row className='text-center'>
        <Card>
          <Card.Header>
            <h1>Predepie Test Task:</h1>
          </Card.Header>

          <Card.Body style={{ textAlign: '-webkit-center' }}>

            <TonConnectButton className='mb-2' />

            <p>You wallet address: {userAddress || 'Wallet not connected.'}</p>

            <Form>

              <Form.Group className='mb-3'>
                <Form.Control
                  type="text"
                  placeholder="Recipient address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='mb-3'>
                <Form.Control
                  type="number"
                  placeholder="Amount (TON)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>

              <Button className='btn btn-success' onClick={sendTransaction} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </Form>
          </Card.Body>

          {(txHash || error) &&
            <Card.Footer className='p-4'>
              {txHash && (
                <div className='my-2'>
                  <p className='text-success'>Transaction sent successfully.</p>
                  <p className='text-info'>BOC: {txHash}</p>
                </div>
              )}

              {error && (
                <div className='my-2'>
                  <p className='text-danger'>{error}</p>
                </div>
              )}
            </Card.Footer>}
        </Card>
      </Row>
    </Container>
  );
}

export default function WrappedApp() {
  return (
    <TonConnectUIProvider manifestUrl="https://predipie-test.vercel.app/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  );
}
