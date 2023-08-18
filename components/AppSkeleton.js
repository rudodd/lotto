// import components
import Skeleton from '@mui/material/Skeleton';

export default function AppSkeleton() {

  return (
    <>
      <div className="skeleton-container">
        <div>
          <Skeleton variant="rounded" height={50} width={300} />
        </div>
        <div>
          <Skeleton variant="rounded" height={20} width={225} />
          <Skeleton variant="rounded" height={40} width={175} />
          <Skeleton variant="rounded" height={20} width={275}/>
        </div>
        <div>
          <Skeleton variant="rounded" height={125} />
        </div>
        <div>
          <Skeleton variant="rounded" height={20} width={125} />
          <Skeleton variant="rounded" height={12} width={200} />
          <Skeleton variant="rounded" height={65} />
          <Skeleton variant="rounded" height={65} />
          <Skeleton variant="rounded" height={65} />
        </div>
        <div>
          <Skeleton variant="rounded" height={45} />
        </div>
      </div>
    </>
  )
}