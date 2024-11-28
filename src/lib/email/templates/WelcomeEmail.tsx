import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import { TailwindConfig } from '@react-email/tailwind'

interface WelcomeEmailProps {
  username: string
  verificationUrl: string
}

export function WelcomeEmail({
  username,
  verificationUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-8 px-4">
          <Heading className="text-2xl font-bold mb-4">
            Welcome, {username}!
          </Heading>
          <Text className="mb-4">
            Thank you for joining our platform. To get started, please verify your
            email address.
          </Text>
          <Link
            href={verificationUrl}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Verify Email
          </Link>
        </Container>
      </Body>
    </Html>
  )
} 