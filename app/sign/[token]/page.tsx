'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const signSchema = z.object({
  signerFirstName: z.string().min(2, "First name is required"),
  signerLastName: z.string().min(2, "Last name is required"),
  signerEmail: z.string().email("Invalid email"),
});

export default function SignDocument() {
  const params = useParams();
  const token = params.token as string;
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signSchema>>({
    resolver: zodResolver(signSchema),
    defaultValues: {
      signerFirstName: '',
      signerLastName: '',
      signerEmail: '',
    }
  });

  useEffect(() => {
    if (token) {
      fetchDocument();
    }
  }, [token]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/document/${token}`);
      setDocument(response.data);
      form.reset({
        signerEmail: response.data.signerEmail,
      });
    } catch (err) {
      setError('Failed to load document. It may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  const onSign = async (values: z.infer<typeof signSchema>) => {
    if (!address) return;
    setSigning(true);
    setError(null);

    try {
      const message = `I confirm that I am signing document: ${document.fileName}`;
      const signature = await signMessageAsync({ message });

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sign/${token}`, {
        signerAddress: address,
        signerEmail: values.signerEmail,
        signerFirstName: values.signerFirstName,
        signerLastName: values.signerLastName,
        signature,
        message,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to sign document. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="flex justify-center p-8 text-red-500"><AlertCircle className="mr-2" /> {error}</div>;
  if (success) return (
    <div className="container mx-auto p-8 max-w-md text-center">
      <Card>
        <CardContent className="pt-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Document Signed!</h2>
          <p className="text-gray-500 mb-4">The document has been successfully signed and recorded on the blockchain.</p>
          <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Sign Document</CardTitle>
          <CardDescription>You have been invited to sign <strong>{document.fileName}</strong></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-secondary/20 rounded-lg">
            <p><strong>Owner:</strong> {document.ownerName}</p>
            <p><strong>File Size:</strong> {(document.fileSize / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          {!isConnected ? (
            <div className="text-center py-8">
              <p className="mb-4">Please connect your wallet to sign this document.</p>
              {/* Connect Button is in the header usually, but we can prompt user */}
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSign)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input {...form.register("signerFirstName")} placeholder="John" />
                  {form.formState.errors.signerFirstName && <p className="text-red-500 text-sm">{form.formState.errors.signerFirstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input {...form.register("signerLastName")} placeholder="Doe" />
                  {form.formState.errors.signerLastName && <p className="text-red-500 text-sm">{form.formState.errors.signerLastName.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input {...form.register("signerEmail")} readOnly className="bg-muted" />
              </div>

              <Button type="submit" className="w-full" disabled={signing}>
                {signing ? <Loader2 className="animate-spin mr-2" /> : null}
                Sign Document
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
