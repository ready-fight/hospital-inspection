# Production delivery checklist

## Implemented

- Tablet-first responsive inspection UI
- Required-result validation
- Inspector name validation
- Handwritten signature capture
- Japanese browser speech input with unsupported-browser feedback
- IndexedDB autosave
- Offline submit queue
- Automatic reconnect retry
- Server-success-only submitted state
- Idempotent Appwrite row ID based on local inspection UUID
- Signature file upload to Appwrite Storage
- Current Appwrite TablesDB integration
- PWA manifest and service worker shell cache
- Health endpoint
- Environment-variable configuration
- Error/success/offline states
- Read-only state after successful submission

## Must be provided / decided before go-live

- Appwrite project IDs and Web Platform host
- Authentication / roles policy
- Actual hospital data source
- Actual equipment data source
- Actual inspection checklist/template
- Who signs the report
- How the hospital and equipment company receive the final report
- Production domain and HTTPS
- Target tablet/browser acceptance testing

## Recommended acceptance tests

- Complete an inspection online and verify Appwrite row + signature file
- Start online, disconnect midway, reload, and verify all input remains
- Submit while offline, reconnect, and verify automatic send
- Force Appwrite error and verify report remains locally retryable
- Draw signature with finger and stylus on target tablets
- Test Japanese speech input on every supported browser/device
- Verify no duplicate row is created after repeated retry
- Clear browser site data and document expected operational impact
