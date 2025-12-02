'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function SignDocumentContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
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
      fetchDocument(token);
    } else {
      setLoading(false);
      setError('No token provided');
    }
  }, [token]);

  const fetchDocument = async (docToken: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/document/${docToken}`);
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
    <div className="container mx-auto p-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign Document</CardTitle>
          <CardDescription>Please review and sign the document below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Document Info</h3>
            <p className="text-sm">File: {document?.fileName}</p>
            <p className="text-sm">Owner: {document?.ownerFirstName} {document?.ownerLastName}</p>
          </div>

          {!isConnected ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-muted-foreground">Please connect your wallet to sign.</p>
              {/* Wallet connect button is usually in the header, but we can add a hint */}
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSign)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signerFirstName">First Name</Label>
                <Input id="signerFirstName" {...form.register("signerFirstName")} />
                {form.formState.errors.signerFirstName && <p className="text-red-500 text-xs">{form.formState.errors.signerFirstName.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signerLastName">Last Name</Label>
                <Input id="signerLastName" {...form.register("signerLastName")} />
                {form.formState.errors.signerLastName && <p className="text-red-500 text-xs">{form.formState.errors.signerLastName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signerEmail">Email</Label>
                <Input id="signerEmail" {...form.register("signerEmail")} disabled />
              </div>

              <Button type="submit" className="w-full" disabled={signing}>
                {signing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign Document
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignDocument() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}>
      <SignDocumentContent />
    </Suspense>
  );
}
