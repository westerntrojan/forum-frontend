import React, {useState, useCallback, useEffect} from 'react';
import {useParams} from 'react-router';
import Typography from '@material-ui/core/Typography';
import BottomScrollListener from 'react-bottom-scroll-listener';
import {Helmet} from 'react-helmet';

import './style.scss';
import Loader from '@components/Loader';
import SmallArticle from '@components/SmallArticle';
import RightBar from '@components/RightBar';
import About from './components/About';
import callApi from '@utils/callApi';
import {IArticle} from '@store/types';
import {IFetchData} from './types';

const Tag: React.FC = () => {
	const {slug} = useParams();

	const [articles, setArticles] = useState<IArticle[]>([]);
	const [loading, setLoading] = useState(true);
	const [end, setEnd] = useState(false);

	const loadMore = useCallback(async () => {
		const skip = articles.length;

		const data: IFetchData = await callApi.get(`/articles/tag/${slug}?skip=${skip}`);

		if (data.articles.length < 10) {
			setEnd(true);
		}

		setArticles(articles.concat(data.articles));
	}, [slug, articles]);

	const getArticles = useCallback(async () => {
		const data: IFetchData = await callApi.get(`/articles/tag/${slug}?skip=0`);

		if (data.articles.length < 10) {
			setEnd(true);
		}

		setArticles(data.articles);

		setLoading(false);
	}, [slug]);

	useEffect(() => {
		if (loading) {
			getArticles();
		}
	}, [getArticles, loading]);

	return (
		<section className='tag'>
			<Helmet>
				<title>
					{`#${slug}`} / {process.env.REACT_APP_TITLE}
				</title>
			</Helmet>

			<div className='articles'>
				<About tag={slug} />

				{loading && <Loader />}

				{!loading && !articles.length && (
					<div className='no-info'>
						<Typography variant='h5'>No articles</Typography>
					</div>
				)}

				{!loading &&
					articles.map((article: IArticle) => <SmallArticle key={article._id} article={article} />)}

				{Boolean(articles.length) && !end && (
					<>
						<Loader />
						<BottomScrollListener onBottom={loadMore} />
					</>
				)}
			</div>

			<RightBar />
		</section>
	);
};

export default Tag;